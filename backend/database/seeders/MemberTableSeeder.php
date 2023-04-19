<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use App\Models\User;
use App\Models\Program;
use App\Models\Member;

class MemberTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $members = Program::pluck('program_id')->toArray();

        $users = User::pluck('user_id')->toArray();
        $faker = Faker::create('Asia/Manila');

        foreach ($members as $member) {
            // Generate a random number between 2 and 5 to determine how many programs to associate with this history id
            $numPrograms = rand(2, 10);

            // Get a random sample of program ids from the array of program ids
            $sampleProgramIds = array_rand($users, $numPrograms);

            foreach ($sampleProgramIds as $sampleProgramId) {
                // Create a new program history record
                $programMember = new Member;

                $programMember->program_id = $member;
                $programMember->user_id = $users[$sampleProgramId];
                $programMember->save();
            }
        }
    }
}
