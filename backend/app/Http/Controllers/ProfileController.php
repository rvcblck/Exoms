<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function index($id){
        $users = User::where('user_id',$id)->get()->first();




        return response()->json($users);
    }
}
