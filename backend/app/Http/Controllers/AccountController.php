<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Program;
use App\Models\Member;
use Illuminate\Support\Facades\DB;
use App\Models\PasswordChange;
use App\Notifications\createAccount;
use App\Notifications\VerifyEmail;
use Illuminate\Support\Carbon;


class AccountController extends Controller
{
    public function index()
    {
        $now = Carbon::now('Asia/Manila');
        $userData = [];

        $users = User::with('programs')->where('archived', false)->get();

        foreach ($users as $user) {



            $programs = $user->programs()->get();
            $ongoing = 0;
            $upcoming = 0;
            $previous = 0;

            foreach ($programs as $program) {

                $endDate = Carbon::parse($program->end_date);
                $startDate = Carbon::parse($program->start_date);
                if ($endDate->lt($now)) {
                    $previous++;
                } else if ($startDate->gt($now)) {
                    $upcoming++;
                } else {
                    $ongoing++;
                }
            }
            $total = $ongoing + $upcoming + $previous;

            $userData[] = [
                'user_id' => $user->user_id,
                'fname' => $user->fname,
                'mname' => $user->mname,
                'lname' => $user->lname,
                'suffix' => $user->suffix,
                'email' => $user->email,
                'mobile_no' => $user->mobile_no,
                'status' => $user->status,
                'previous' => $previous,
                'ongoing' => $ongoing,
                'upcoming' => $upcoming,
                'total' => $total
            ];
        }


        return response()->json($userData);
    }


    public function getArchives()
    {
        $now = Carbon::now('Asia/Manila');
        $userData = [];

        $users = User::with('programs')->where('archived', true)->get();

        foreach ($users as $user) {



            $programs = $user->programs()->get();
            $ongoing = 0;
            $upcoming = 0;
            $previous = 0;

            foreach ($programs as $program) {

                $endDate = Carbon::parse($program->end_date);
                $startDate = Carbon::parse($program->start_date);
                if ($endDate->lt($now)) {
                    $previous++;
                } else if ($startDate->gt($now)) {
                    $upcoming++;
                } else {
                    $ongoing++;
                }
            }
            $total = $ongoing + $upcoming + $previous;

            $userData[] = [
                'user_id' => $user->user_id,
                'fname' => $user->fname,
                'mname' => $user->mname,
                'lname' => $user->lname,
                'suffix' => $user->suffix,
                'email' => $user->email,
                'mobile_no' => $user->mobile_no,
                'status' => $user->status,
                'previous' => $previous,
                'ongoing' => $ongoing,
                'upcoming' => $upcoming,
                'total' => $total
            ];
        }


        return response()->json($userData);
    }

    public function store(Request $request)
    {
        if (User::where('email', $request->email)->exists()) {
            return response()->json([
                'error' => 'Email is already registered'
            ], 401);
        }

        // $password_id = $this->generatePasswordId();

        $user_id = $this->generateUserId();

        $password = $this->generatePassword();

        //i want to generate password minimum of 8 characters, combination of upper and lower case character and number


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
            'status' => 'approve',
            'email_verified_at' => now('Asia/Manila')

        ]);

        $password_id = $this->generatePasswordId();

        PasswordChange::create([
            'password_id' => $password_id,
            'user_id' =>  $user_id,
            'password' => bcrypt($password),
            'change_date' => now('Asia/Manila')
        ]);

        $userDetails = [
            'email' => $request->email,
            'password' => $password
        ];

        $user->notify(new createAccount($userDetails));
        $user->notify(new createAccount($userDetails));

        return response()->json([
            'success' => true,
            'message' => 'Account Created',
        ]);
    }

    public function generatePassword()
    {
        $length = 8;
        $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $password = '';
        for ($i = 0; $i < $length; $i++) {
            $password .= $chars[rand(0, strlen($chars) - 1)];
        }
        return $password;
    }


    public function approveAccount(Request $request)
    {
        $accountIds = $request->input('accountIds');
        foreach ($accountIds as $accountId) {
            $account = User::find($accountId);
            $account->status = 'approve';
            $account->save();
        }
        return response()->json(['message' => 'Accounts approved successfully']);
    }


    public function disapproveAccount(Request $request)
    {

        $accountIds = $request->input('accountIds');


        if ($accountIds) {
            foreach ($accountIds as $accountId) {
                $account = User::find($accountId);
                $account->status = 'rejected';
                $account->save();
            }
        } else {
            return response()->json(['message' => 'No $accountIds']);
        }

        return response()->json(['message' => 'Accounts disapproved successfully']);
    }

    public function accountInfo($id)
    {

        $now = Carbon::now('Asia/Manila')->toDateTimeString();
        $userData = [];

        $user = User::with('programs')->where('user_id', $id)->first();


        $programDataPrevious = [];
        $programDataOngoing = [];
        $programDataUpcoming = [];

        $ongoing = $user->programs()
            ->where('end_date', '>=', $now)
            ->where('start_date', '<=', $now)
            ->count();

        $upcoming = $user->programs()->where('start_date', '>', $now)->count();
        $previous = $user->programs()->where('end_date', '<', $now)->count();

        $programsPrevious = $user->programs()->where('end_date', '<', $now)->get();
        foreach ($programsPrevious as $program) {
            $programDataPrevious[] = [
                'program_id' => $program->program_id,
                'title' => $program->title,
                'start_date' => $program->start_date,
                'end_date' => $program->end_date,
                'leader' => $program->pivot->leader,

            ];
        }


        $programsOngoing = $user->programs()->where('end_date', '>=', $now)->where('start_date', '<=', $now)->get();
        foreach ($programsOngoing as $program) {
            $programDataOngoing[] = [
                'program_id' => $program->program_id,
                'title' => $program->title,
                'start_date' => $program->start_date,
                'end_date' => $program->end_date,
                'leader' => $program->pivot->leader,

            ];
        }


        $programsUpcomming = $user->programs()->where('start_date', '>', $now)->get();
        foreach ($programsUpcomming as $program) {
            $programDataUpcoming[] = [
                'program_id' => $program->program_id,
                'title' => $program->title,
                'start_date' => $program->start_date,
                'end_date' => $program->end_date,
                'leader' => $program->pivot->leader,

            ];
        }


        $userData = [
            'user_id' => $user->user_id,
            'fname' => $user->fname,
            'mname' => $user->mname,
            'lname' => $user->lname,
            'suffix' => $user->suffix,
            'gender' => $user->gender,
            'bday' => $user->bday,
            'email' => $user->email,
            'mobile_no' => $user->mobile_no,
            'address' => $user->address,
            'status' => $user->status,
            'profile_pic' => $user->profile_pic,
            'previous' => $previous,
            'ongoing' => $ongoing,
            'upcoming' => $upcoming,
            'programs_previous' => $programDataPrevious,
            'programs_ongoing' => $programDataOngoing,
            'programs_upcoming' => $programDataUpcoming,

        ];





        return response()->json($userData);
    }

    public function selectAccount()
    {

        $users = User::where('archived', false)->get();
        $userData = [];
        foreach ($users as $user) {

            $userData[] = [
                'user_id' => $user->user_id,
                'fname' =>  $user->fname,
                'lname' => $user->lname

            ];
        }
        return response()->json($userData);
    }


    public function archiveAccount($user_id)
    {
        $user = User::where('user_id', $user_id)->first();

        if ($user) {
            $user->archived = true;
            $user->save();
        } else {
            return response()->json([
                'success' => false,
                'message' => 'User ID not found',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'User archive successfuly',
        ]);
    }

    public function unarchivedAccount(Request $request)
    {
        $user_ids = $request->input('user_ids');
        foreach ($user_ids as $user_id) {
            $user = User::where('user_id', $user_id)->first();
            if ($user) {
                $user->archived = false;
                $user->save();
            }
        }
        return response()->json([
            'success' => true,
            'message' => 'User unarchived successfully',
        ]);
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
}
