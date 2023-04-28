<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Program;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class AttendanceTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
<<<<<<< Updated upstream
=======
        $faker = Faker::create('Asia/Manila');
>>>>>>> Stashed changes
        $programs = Program::with('participants')->get();

        foreach ($programs as $program) {

            //$program->start_date  -  $program->end_date
            //get random date from start_date and end_date and it should be in sequence
            //store the dates in object
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
            $start_date = Carbon::parse($program->start_date);
            $end_date = Carbon::parse($program->end_date);
            $date_diff = $start_date->diffInDays($end_date);

            // Make sure there are at least 15 days between start_date and end_date
<<<<<<< Updated upstream
            // if ($date_diff < 15) {
=======
            // if ($date_diff > 10) {
>>>>>>> Stashed changes
            //     continue;
            // }

            // Create an array of 15 random dates between start_date and end_date
            $dates = [];
<<<<<<< Updated upstream
            for ($i = 0; $i < $date_diff; $i++) {
=======
            for ($i = 0; $i < 10; $i++) {
>>>>>>> Stashed changes
                $random_day = rand(0, $date_diff);
                $date = $start_date->copy()->addDays($random_day);
                $dates[] = $date;
            }

            // Sort the dates in ascending order
            sort($dates);

            $participants = $program->participants()->get();

<<<<<<< Updated upstream
            foreach($participants as $participant){

                    foreach($dates as $date){
                        Attendance::create([
                            'attendance_id' => $this->generateAttendanceId(),
                            'participant_id' => $participant->participant_id,
                            'date' => $date->format('Y-m-d'),
                        ]);
                    }


=======
            foreach ($participants as $participant) {


                //create attendance for each participant

                foreach ($dates as $date) {
                    Attendance::create([
                        'attendance_id' => $this->generateAttendanceId(),
                        'participant_id' => $participant->participant_id,
                        'date' => $date->format('Y-m-d'),
                        'status' => $faker->randomElement(['present', 'absent']),
                    ]);
                }

                // $attendance = Attendance::where('participant_id', $participant->participant_id)->get();

                // foreach ($attendance as $attendee) {




                // }
>>>>>>> Stashed changes
            }
        }
    }
    public function generateAttendanceId()
    {
        $attendance_id = 'ATT-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
        $existing_attendance_id = Attendance::where('attendance_id', $attendance_id)->first();
        while ($existing_attendance_id) {
            $attendance_id = 'ATT-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
            $existing_attendance_id = Attendance::where('attendance_id', $attendance_id)->first();
        }
        return $attendance_id;
    }
}
