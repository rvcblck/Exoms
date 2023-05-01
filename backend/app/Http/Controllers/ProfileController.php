<?php

namespace App\Http\Controllers;

use App\Models\PasswordChange;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    public function index($id)
    {
        $users = User::where('user_id', $id)->get()->first();




        return response()->json($users);
    }

    public function updateProfile(Request $request)
    {

        $rules = [
            'fname' => 'required',
            'lname' => 'required',
            'gender' => 'required',
            'bday' => 'required',
            'mobile_no' => 'required',
            'address' => 'required',
        ];


        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }




        User::where('user_id', $request->user_id)->update([
            'fname' => $request->fname,
            'lname' => $request->lname,
            'mname' => $request->mname,
            'suffix' => $request->suffix,
            'gender' => $request->gender,
            'bday' => $request->bday,
            'mobile_no' => $request->mobile_no,
            'address' => $request->address,
        ]);


        return response()->json([
            'success' => true,
            'message' => 'Profile Update Success',
        ]);
    }

    public function isEmailAvailable($email)
    {
        $email = User::where('email', $email)->first();

        if ($email) {
            return response()->json([
                'success' => true,
                'message' => 'Not Available',
            ]);
        } else {
            return response()->json([
                'success' => true,
                'message' => 'Available',
            ]);
        }
    }

    public function changeEmail(Request $request)
    {

        $rules = [
            'email' => 'required',
            'user_id' => 'required',
            'password' => 'required',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }


        $email = User::where('email', $request->email)->first();

        if ($email) {
            return response()->json([
                'success' => false,
                'message' => 'Not Available',
            ], 401);
        }

        $checkPass = PasswordChange::where('user_id', $request->user_id)->latest()->first();



        if ($checkPass) {
            if (!Hash::check($request->password, $checkPass->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Wrong Password',
                ], 401);
            }
        }
        User::where('user_id', $request->user_id)->update([
            'email' => $request->email,
            'email_verified_at' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Email Change Success',
        ]);
    }

    public function changePass(Request $request)
    {
        $rules = [
            'user_id' => 'required',
            'old_password' => 'required',
            'new_password' => 'required',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }



        $checkPass = PasswordChange::where('user_id', $request->user_id)->latest()->first();



        if ($checkPass) {
            if (!Hash::check($request->old_password, $checkPass->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Wrong Password',
                ], 401);
            }
        }
        if ($checkPass) {
            if (!Hash::check($request->new_password, $checkPass->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'You cant set the same password',
                ], 401);
            }
        }




        PasswordChange::create([
            'password_id' => $this->generatePasswordId(),
            'user_id' => $request->user_id,
            'password' => bcrypt($request->new_password),
            'change_date' => now('Asia/Manila'),

        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password Change Success',
        ]);
    }



    public function changeProfilePic(Request $request)
    {


        $rules = [
            'user_id' => 'required',
            'profile_pic' => 'required',

        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }


        // $user = User::where('user_id',$request->user_id)->first();

        Storage::makeDirectory('public/user/' . $request->user_id);

        $profile_pic = $request->file('profile_pic');



        // Get the program directory
        $userDir = 'user/' . $request->user_id;

        // Get all files in the program directory
        $file = Storage::files($userDir);
        Storage::delete($file);

        $filename = $profile_pic->getClientOriginalName();
        $new_filename = $filename;
        $profile_pic_path = Storage::putFileAs('user/' . $request->user_id, $profile_pic, $new_filename);

        User::where('user_id', $request->user_id)->update([
            'profile_pic' => $profile_pic_path
        ]);
    }

    public function profileImage($id)
    {
        $user = User::where('user_id', $id)->first();

        $file_path = $user->profile_pic;

        // dd($file_path);

        if ($file_path) {
            $path = storage_path('app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . $file_path);
            if (!File::exists($path)) {
                abort(404);
            }

            $file = File::get($path);
            $type = File::mimeType($path);
            $response = new Response($file, 200);
            $response->header("Content-Type", $type);
            return $response;
        } else {
            $path = storage_path('app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . $file_path);
            if (!File::exists($path)) {
                abort(404);
            }

            $file = File::get($path);
            $type = File::mimeType($path);
            $response = new Response($file, 200);
            $response->header("Content-Type", $type);
            return $response;
        }
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



    public function usersProfileImages(Request $request)
    {
        $userIds = $request->input('user_ids');

        $images = [];

        foreach ($userIds as $id) {
            $user = User::where('user_id', $id)->first();
            $file_path = $user->profile_pic;

            if ($file_path) {
                $path = storage_path('app\public\\' . $file_path);
                if (File::exists($path)) {
                    $data = base64_encode(file_get_contents($path));
                    $images[] = $data;
                }
            } else {
                $path = storage_path('app\public\images\profile-default.png');
                if (File::exists($path)) {
                    $data = base64_encode(file_get_contents($path));
                    $images[] = $data;
                }
            }
        }


        return $images;
    }
}
