<?php

namespace Database\Seeders;
use App\Models\Program;
use App\Models\Member;

use Illuminate\Database\Seeder;

class LeaderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Get all program IDs from the programs table
        $programs = Program::all();

        // Loop through programs
        foreach ($programs as $program) {
            // Get all members for the program
            $members = Member::where('program_id', $program->program_id)->get();

            // Get a random member
            $leader = $members->random();

            // Set the member as the leader for the program
            $leader->leader = true;
            $leader->save();
        }
    }
}
