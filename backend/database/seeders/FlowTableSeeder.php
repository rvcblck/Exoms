<?php

namespace Database\Seeders;

use App\Models\Flow;
use App\Models\Program;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FlowTableSeeder extends Seeder
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

            Flow::create([
                'flow_id' => $this->generateflowId(),
                'program_id' => $program->program_id,
                'flow' => 'Invocation',
                'description' => 'Audio Visual Presentation',
                'arrangement' => '1',
                'archived' => false,
            ]);

            Flow::create([
                'flow_id' => $this->generateflowId(),
                'program_id' => $program->program_id,
                'flow' => 'National Anthem',
                'description' => 'Audio Visual Presentation',
                'arrangement' => '2',
                'archived' => false,
            ]);
            Flow::create([
                'flow_id' => $this->generateflowId(),
                'program_id' => $program->program_id,
                'flow' => 'BulSU Hymn',
                'description' => 'Audio Visual Presentation',
                'arrangement' => '3',
                'archived' => false,
            ]);

            Flow::create([
                'flow_id' => $this->generateflowId(),
                'program_id' => $program->program_id,
                'flow' => 'Opening Remarks',
                'description' => 'Ms.Lourdes M. Tiongson, CICT CESU Head',
                'arrangement' => '4',
                'archived' => false,
            ]);
            Flow::create([
                'flow_id' => $this->generateflowId(),
                'program_id' => $program->program_id,
                'flow' => 'Recognition of Attendees',
                'description' => 'Moderator',
                'arrangement' => '5',
                'archived' => false,
            ]);

            Flow::create([
                'flow_id' => $this->generateflowId(),
                'program_id' => $program->program_id,
                'flow' => 'Introducation of Speaker',
                'description' => 'Ms. Desserie Rose Jinco',
                'arrangement' => '6',
                'archived' => false,
            ]);

            Flow::create([
                'flow_id' => $this->generateflowId(),
                'program_id' => $program->program_id,
                'flow' => 'Session Paper',
                'description' => 'Mr. Jhon Michael Calizon',
                'arrangement' => '7',
                'archived' => false,
            ]);
        }
    }
    public function generateflowId()
    {
        $program_id = 'FLOW-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
        $existing_program_id = Flow::where('flow_id', $program_id)->first();
        while ($existing_program_id) {
            $program_id = 'FLOW-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
            $existing_program_id = Flow::where('flow_id', $program_id)->first();
        }
        return $program_id;
    }
}
