<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Program;
use Faker\Factory as Faker;
use Carbon\Carbon;

class ProgramTableSeeder extends Seeder
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
            $program = new Program;
            $program->program_id = $this->generateProgramId();
            $program->title = 'Sample Program '.$i;
            $startDate = $program->start_date = $faker->dateTimeBetween('-1 year', '+1 year');
            $endDate = clone $startDate;
            $endDate->modify('+' . random_int(1, 3) . ' months');
            $program->end_date = $endDate;
            $program->place = $faker->address;
            $program->details = $faker->paragraph(2);
            $program->save();
        }
    }

    public function generateProgramId() {
        $program_id = 'PROG-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
        $existing_program_id = Program::where('program_id', $program_id)->first();
        while($existing_program_id) {
            $program_id = 'PROG-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
            $existing_program_id = Program::where('program_id', $program_id)->first();
        }
        return $program_id;
    }

    public function generateMemberId() {
        $member_id = 'MBR-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
        $existing_member_id = Program::where('member_id', $member_id)->first();
        while($existing_member_id) {
            $member_id = 'MBR-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
            $existing_member_id = Program::where('member_id', $member_id)->first();
        }
        return $member_id;
    }

    public function generateParticipantId() {
        $participant_id = 'PART-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
        $existing_participant_id = Program::where('participant_id', $participant_id)->first();
        while($existing_participant_id) {
            $participant_id = 'PART-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
            $existing_participant_id = Program::where('participant_id', $participant_id)->first();
        }
        return $participant_id;
    }



    public function generateCertId() {
        $cert_id = 'CERT-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
        $existing_cert_id = Program::where('cert_id', $cert_id)->first();
        while($existing_cert_id) {
            $cert_id = 'CERT-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
            $existing_cert_id = Program::where('cert_id', $cert_id)->first();
        }
        return $cert_id;
    }
}
