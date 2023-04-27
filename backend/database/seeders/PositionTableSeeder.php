<?php

namespace Database\Seeders;

use App\Models\Position;
use App\Models\Program;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class PositionTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()


    {

        $faker = Faker::create('Asia/Manila');
        $programs = Program::with('users')->get();



        foreach ($programs as $program) {

            $users = $program->users()->wherePivot('leader', null)->get();
            foreach ($users as $user) {
                $fullName = $user->fname . ' ' . $user->mname . ' ' . $user->lname . '  ' . $user->suffix;
                Position::create([
                    'position_id' => $this->generatePostionId(),
                    'program_id' => $program->program_id,
                    'name' => $fullName,
                    'position' => $faker->randomElement(['technical', 'moderator', 'speaker', 'invitation/report']),
                    'archived' => false,
                ]);
            }
        }
    }
    public function generatePostionId()
    {
        $program_id = 'POS-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
        $existing_program_id = Position::where('position_id', $program_id)->first();
        while ($existing_program_id) {
            $program_id = 'POS-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
            $existing_program_id = Position::where('position_id', $program_id)->first();
        }
        return $program_id;
    }
}
