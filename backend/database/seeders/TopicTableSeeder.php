<?php

namespace Database\Seeders;

use App\Models\Program;
use App\Models\Topic;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TopicTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $programs = Program::all();

        foreach ($programs as $program) {

            Topic::create([
                'topic_id' => $this->generateTopicId(),
                'program_id' => $program->program_id,
                'col_1' => 'Look and Plan',
                'col_2' => 'A day in life of an online student',
                'col_3' => 'wake up, eat breakfast, get ready for an awesome day',
                'archived' => false,
            ]);

            Topic::create([
                'topic_id' => $this->generateTopicId(),
                'program_id' => $program->program_id,
                'col_1' => 'Setup',
                'col_2' => 'Set up your classroom environment',
                'col_3' => 'blend your physicsl classroom and your virtual classrom',
                'archived' => false,
            ]);

            Topic::create([
                'topic_id' => $this->generateTopicId(),
                'program_id' => $program->program_id,
                'col_1' => 'Set the tone',
                'col_2' => 'Meet with you students',
                'col_3' => 'Teams meeting tips for the best online experience increase effectiveness',
                'archived' => false,
            ]);
        }
    }
    public function generateTopicId()
    {
        $program_id = 'TPC-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
        $existing_program_id = Topic::where('topic_id', $program_id)->first();
        while ($existing_program_id) {
            $program_id = 'TPC-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
            $existing_program_id = Topic::where('topic_id', $program_id)->first();
        }
        return $program_id;
    }
}
