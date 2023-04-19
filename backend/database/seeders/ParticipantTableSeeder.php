<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Participant;
use Faker\Factory as Faker;

class ParticipantTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();

        // Get all program IDs from the programs table
        $programIds = DB::table('programs')->pluck('program_id');

        foreach ($programIds as $programId) {
            // Generate a random number of participants between 5-10
            $numParticipants = $faker->numberBetween(5, 10);

            // Create the participants for this program
            for ($i = 0; $i < $numParticipants; $i++) {
                DB::table('participants')->insert([
                    'participant_id' => $this->generateParticipantId(),
                    'program_id' => $programId,
                    'name' => $faker->name(),

                ]);
            }
        }
    }
    public function generateParticipantId() {
        $participant_id = 'PART-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
        $existing_participant_id = Participant::where('participant_id', $participant_id)->first();
        while($existing_participant_id) {
            $participant_id = 'PART-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
            $existing_participant_id = Participant::where('participant_id', $participant_id)->first();
        }
        return $participant_id;
    }
}
