<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\PasswordChange;
// use App\Models\PasswordChange;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Auth\Events\Verified;
use App\Notifications\VerifyEmail;
use App\Notifications\ResetPassword;
use Illuminate\Support\Facades\Mail;
use App\Models\VerificationCode;
use Illuminate\Support\Str;




class AuthController extends Controller
{
    public function login(Request $request)
    {

        // Validate Required
        $credentials = $request->only('email', 'password');
        $validator = Validator::make($credentials, [
            'email' => 'required|email',
            'password' => 'required',
        ]);


        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Email and Password Required',
                'errors' => $validator->errors(),
            ], 401);
        }

        //check email
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'No registered email found',
            ], 401);
        }

        //email valid or not
        $emailValid =  User::where('email', $request->email)
            ->whereNotNull('email_verified_at')
            ->first();
        if (!$emailValid) {
            return response()->json([
                'success' => false,
                'message' => 'Email is not yet validated',
            ], 401);
        }


        //check password
        $passwordChange = $user->passwordChanges()->latest()->first();
        if ($passwordChange) {
            if (!Hash::check($request->password, $passwordChange->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials',
                ], 401);
            }
        }

        //return token
        $token = JWTAuth::fromUser($user);
        return response()->json([
            'success' => true,
            'message' => 'Logged in successfully',
            'token' => $token,
            'user' => $user,
        ]);
    }


    public function register(Request $request)
    {
        if (User::where('email', $request->email)->exists()) {
            return response()->json([
                'message' => 'Email is already registered'
            ], 401);
        }

        $password_id = $this->generatePasswordId();

        $user_id = $this->generateUserId();


        $user = User::create([
            'user_id' => $user_id,
            'fname' => $request->fname,
            'lname' => $request->lname,
            'mname' => $request->mname,
            'suffix' => $request->suffix,
            'gender' => $request->gender,
            'bday' => $request->bday,
            'mobile_no' => $request->mobile_no,
            'email' => $request->email,
            'address' => $request->address,

        ]);



        PasswordChange::create([
            'password_id' => $password_id,
            'user_id' =>  $user_id,
            'password' => bcrypt($request->password),
            'change_date' => now('Asia/Manila')
        ]);

        $code = $this->generateVerificationCode();

        $verify_id = $this->generateVerifyId();

        // Create new verification code record
        $expires_at = now('Asia/Manila')->addMinutes(2);
        VerificationCode::create([
            'verify_id' => $verify_id,
            'user_id' => $user_id,
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


    public function resendCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        $code = $this->generateVerificationCode();
        $expires_at = now('Asia/Manila')->addMinutes(2);

        VerificationCode::where('user_id', $user->user_id)
            ->update(['code' => $code, 'expires_at' => $expires_at]);

        $user->notify(new VerifyEmail($code));

        return response()->json(['message' => 'Verification code has been sent to your email.'], 200);
    }

    public function forgotPassword(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $passwordChange = PasswordChange::where('user_id', $user->user_id)->first();

        if ($passwordChange) {

            $resetToken = $this->generateUniqueToken();

            PasswordChange::where('user_id', $user->user_id)->latest()
                ->update([
                    'reset_token' => $resetToken,
                ]);

            $user->notify(new ResetPassword($resetToken));

            return response()->json(['message' => 'Password reset email sent'], 200);
        } else {

            $resetToken = $this->generateUniqueToken();

            PasswordChange::create([
                'password_id' => $this->generatePasswordId(),
                'user_id' => $user->user_id,
                'password' => 'user',
                'reset_token' => $resetToken

            ]);

            $user->notify(new ResetPassword($resetToken));

            return response()->json(['message' => 'Password reset email sent'], 200);
        }
    }

    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'resetToken' => 'required',
            'password' => 'required|min:6',
            'email' => 'required',
        ]);


        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }


        $pass =  PasswordChange::where('reset_token', $request->resetToken)->first();

        if (!$pass) {
            return response()->json(['success' => false, 'message' => 'Invalid reset token'], 400);
        }

        $user_id = User::where('email', $request->email)->first();


        $password_id = $this->generatePasswordId();
        PasswordChange::create([
            'password_id' => $password_id,
            'user_id' => $user_id->user_id,
            'password' => bcrypt($request->password),
            'change_date' => now('Asia/Manila'),
        ]);

        if (!$user_id->email_verified_at) {
            User::where('user_id', $user_id->user_id)
                ->update([
                    'email_verified_at' => now('Asia/Manila')
                ]);
        }
        return response()->json(['success' => true, 'message' => 'Password reset successfully']);
    }

    public function checkResetToken(Request $request, $token)
    {
        $user = PasswordChange::where('reset_token', $token)->first();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid reset password token'
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Reset password token is valid'
        ]);
    }


    public function generatePasswordId()
    {
        $password_id = 'PASS-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
        $existing_password_id = PasswordChange::where('password_id', $password_id)->first();
        while ($existing_password_id) {
            $password_id = 'PASS-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
            $existing_password_id = PasswordChange::where('password_id', $password_id)->first();
        }
        return $password_id;
    }

    public function generateUserId()
    {
        $user_id = 'USER-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
        $existing_user_id = User::where('user_id', $user_id)->first();
        while ($existing_user_id) {
            $user_id = 'USER-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
            $existing_user_id = User::where('user_id', $user_id)->first();
        }
        return $user_id;
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

    private function generateVerificationCode()
    {
        $code = rand(100000, 999999);
        return strval($code);
    }

    function generateUniqueToken(): string
    {
        do {
            $resetToken = Str::random(60);
        } while (PasswordChange::where('reset_token', $resetToken)->exists());

        return $resetToken;
    }
}
