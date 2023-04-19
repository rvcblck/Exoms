<?php

namespace Database\Seeders;
use App\Models\PasswordChange;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

use Illuminate\Database\Seeder;

class UserSeeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $password_id = $this->generatePasswordId();
        $user_id = $this->generateUserId();

        User::create([
            'user_id' => $user_id,
            'fname' => 'user',
            'lname' => 'user',
            'email' => 'user@gmail.com',
            'email_verified_at' => now('Asia/Manila'),
            'role' => 'user',



        ]);


        PasswordChange::create([
            'password_id' => $password_id,
            'user_id' => $user_id,
            'password' => Hash::make('user123'),
            'change_date' => now('Asia/Manila'),
        ]);
    }

    public function generatePasswordId() {
        $password_id = 'PASS-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
        $existing_password_id = PasswordChange::where('password_id', $password_id)->first();
        while($existing_password_id) {
            $password_id = 'PASS-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
            $existing_password_id = PasswordChange::where('password_id', $password_id)->first();
        }
        return $password_id;
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
