<?php

namespace Database\Seeders;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\PasswordChange;

use Illuminate\Database\Seeder;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create('Asia/Manila');

        for ($i = 0; $i < 50; $i++) {
            $user = new User;
            $user->user_id = $this->generateUserId();
            $user->fname = $faker->firstName;
            $user->mname = $faker->optional()->lastName;
            $user->lname = $faker->lastName;
            $user->suffix = $faker->optional()->suffix;
            $user->gender = $faker->randomElement(['male', 'female', 'other']);
            $user->bday = $faker->dateTimeBetween('-60 years', '-18 years')->format('Y-m-d');
            $user->email = $faker->unique()->safeEmail;
            $user->mobile_no = $faker->optional()->phoneNumber;
            $user->address = $faker->optional()->address;
            $user->status = $faker->randomElement(['rejected', 'approve', 'pending']);
            // $user->archived = $faker->boolean(10); // 20% chance of being true
            $user->save();
        }
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
