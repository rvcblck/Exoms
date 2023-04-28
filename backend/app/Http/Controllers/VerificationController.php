<?php

namespace App\Http\Controllers;

use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Models\VerificationCode;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Models\User;
use App\Notifications\VerifyEmail;
// use Illuminate\Support\Facades\Validator;

use Illuminate\Http\Request;

class VerificationController extends Controller
{
    // public function verify(EmailVerificationRequest $request)
    // {
    //     $request->fulfill();

    //     event(new Verified($request->user()));

    //     return redirect('http://localhost:4200/user/dashboard');
    // }


    public function verifyEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => [
                'required',
                'email',
                Rule::exists('users', 'email')->where(function ($query) {
                    $query->where('email_verified_at', null);
                }),
            ],
            'code' => 'required|string|min:6|max:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $verificationCode = VerificationCode::where('user_id', $user->user_id)
            ->latest()
            ->first();

        if (!$verificationCode) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($verificationCode->code !== $request->code) {
            return response()->json(['message' => 'Invalid verification code.'], 422);
        }

        if ($verificationCode->expires_at->lt(Carbon::now('Asia/Manila'))) {
            return response()->json(['message' => 'Verification code has expired.'], 422);
        }

        $user->email_verified_at = now('Asia/Manila');
        $user->save();

        VerificationCode::where('user_id', $user->user_id)->delete();

        return response()->json(['message' => 'Email verified successfully.'], 200);
    }

    public function sendEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Email is required',
                'errors' => $validator->errors(),
            ], 401);
        }

        $user = User::where('email', $request->email)->first();

        $code = $this->generateVerificationCode();

        // Create new verification code record
        $expires_at = now('Asia/Manila')->addMinutes(2);
        VerificationCode::create([
            'verify_id' => $this->generateVerifyId(),
            'user_id' => $user->user_id,
            'code' => $code,
            'expires_at' => $expires_at
        ]);

        $user->notify(new VerifyEmail($code));

        return response()->json([
            'success' => true,
            'message' => 'Please verify your email address by clicking on the verification link sent to your email',
            'email' => $request->email,
            'password' => $request->password,
        ]);
    }

    private function generateVerificationCode()
    {
        $code = rand(100000, 999999);
        return strval($code);
    }

    public function generateVerifyId()
    {
        $verify_id = 'VER-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
        $existing_verify_id = VerificationCode::where('verify_id', $verify_id)->first();
        while ($existing_verify_id) {
            $verify_id = 'VER-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
            $existing_verify_id = VerificationCode::where('verify_id', $verify_id)->first();
        }
        return $verify_id;
    }
}
