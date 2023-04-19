<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Program;
use App\Models\Member;
use Illuminate\Support\Facades\DB;
use App\Models\PasswordChange;
use Illuminate\Support\Carbon;


class AccountController extends Controller
{
    public function index()
    {
        $now = Carbon::now('Asia/Manila');
        $userData = [];

        $users = User::with('programs')->get();

        foreach($users as $user){



            $programs = $user->programs()->get();
            $ongoing = 0;
            $upcoming = 0;
            $previous = 0;

            foreach($programs as $program){

                $endDate = Carbon::parse($program->end_date);
                $startDate = Carbon::parse($program->start_date);
                if($endDate->lt($now)){
                    $previous++;
                }else if($startDate->gt($now)){
                    $upcoming++;
                }else{
                    $ongoing++;
                }
                // dd('tae');
            }


            // foreach($programs as $program){



            // }

            $userData [] = [
                'user_id' => $user->user_id,
                'fname' => $user->fname,
                'mname' => $user->mname,
                'lname' => $user->lname,
                'suffix' => $user->suffix,
                // 'gender' => $data->gender,
                // 'bday' => $data->bday,
                'email' => $user->email,
                'mobile_no' => $user->mobile_no,
                // 'address' => $data->address,
                'status' => $user->status,
                // 'archived' => $data->archived,
                // 'programs' => [$program],
                'previous' => $previous,
                'ongoing' => $ongoing,
                'upcoming' => $upcoming,
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


        User::create([
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
            'status' => 'approved'

        ]);



        // PasswordChange::create([
        //     'password_id' => $password_id,
        //     'user_id' => $user_id,
        //     'password' => bcrypt($request->password),
        //     'change_date' => now('Asia/Manila')
        // ]);


        return response()->json([
            'success' => true,
            'message' => 'Account Created',
        ]);
    }

    // public function show($id)
    // {
    //     $account = User::find($id);
    //     if (!$account) {
    //         return response()->json(['error' => 'Account not found'], 404);
    //     }
    //     return response()->json($account);
    // }

    // public function update(Request $request, $id)
    // {
    //     $account = User::find($id);
    //     if (!$account) {
    //         return response()->json(['error' => 'Account not found'], 404);
    //     }
    //     $account->name = $request->input('name');
    //     $account->email = $request->input('email');
    //     $account->mobile = $request->input('mobile');
    //     $account->status = $request->input('status');
    //     $account->previous = $request->input('previous');
    //     $account->ongoing = $request->input('ongoing');
    //     $account->upcoming = $request->input('upcoming');
    //     $account->save();
    //     return response()->json(['message' => 'Account updated successfully']);
    // }

    // public function destroy($id)
    // {
    //     $account = User::find($id);
    //     if (!$account) {
    //         return response()->json(['error' => 'Account not found'], 404);
    //     }
    //     $account->delete();
    //     return response()->json(['message' => 'Account deleted successfully']);
    // }

    //AccountController.php
    public function approveAccount(Request $request){
        $accountIds = $request->input('accountIds');
        foreach ($accountIds as $accountId) {
        $account = User::find($accountId);
        $account->status = 'approved';
        $account->save();
        }
        return response()->json(['message' => 'Accounts approved successfully']);
    }


    public function disapproveAccount(Request $request){

        $accountIds = $request->input('accountIds');


        if($accountIds){
            foreach ($accountIds as $accountId) {
                $account = User::find($accountId);
                $account->status = 'disapproved';
                $account->save();
            }
        }else{
            return response()->json(['message' => 'No $accountIds']);
        }

        return response()->json(['message' => 'Accounts disapproved successfully']);
    }

    public function accountInfo($id){

        $now = Carbon::now('Asia/Manila');
        $userData = [];

        $user = User::with('programs')->where('user_id',$id)->first();


            $programData = [];
            $programs = $user->programs()->get();
            $ongoing = 0;
            $upcoming = 0;
            $previous = 0;


            // foreach($programs as $program){
            //     $leader = [];
            //     $programLeader = $program->members()->wherePivot('leader',true)->get();
            //     if($programLeader){
            //         $leader = [
            //             'program_id' => $programLeader->program_id,
            //         ];

            //     }
            // }

            // dd($programLeader);

            foreach($programs as $program){

                $programData [] = [
                    'program_id' => $program->program_id,
                    'title' => $program->title,
                    // 'start_date' => $program->start_date,
                    // 'end_date' => $program->end_date,
                    'leader' => $program->pivot->leader,

                ];



                $endDate = Carbon::parse($program->end_date);
                $startDate = Carbon::parse($program->start_date);
                if($endDate->lt($now)){
                    $previous++;
                }else if($startDate->gt($now)){
                    $upcoming++;
                }else{
                    $ongoing++;
                }
                // dd('tae');
            }


            // foreach($programs as $program){



            // }

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
                'previous' => $previous,
                'ongoing' => $ongoing,
                'upcoming' => $upcoming,
                'programs' => $programData,
                // 'leader' => $leader,
            ];





        return response()->json($userData);



    }

    

    public function generateUserId() {
        $user_id = 'USER-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
        $existing_user_id = User::where('user_id', $user_id)->first();
        while($existing_user_id) {
            $user_id = 'USER-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
            $existing_user_id = User::where('user_id', $user_id)->first();
        }
        return $user_id;
    }



}
