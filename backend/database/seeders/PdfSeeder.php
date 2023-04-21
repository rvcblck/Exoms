<?php

namespace Database\Seeders;

use App\Models\Program;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class PdfSeeder extends Seeder
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
            // Update invitation column
            $invitationPath = null;
            // if (Storage::exists($invitationPath)) {
                $program->invitation = null;
            // }

            // Update certificate column
            $certificatePath = null;
            // if (Storage::exists($certificatePath)) {
                $program->certificate = null;
            // }

            $program->save();
        }
    }
}
