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
            $invitationPath = 'public/images/Rovic_DeLeon.pdf';
            if (Storage::exists($invitationPath)) {
                $program->invitation = $invitationPath;
            }

            // Update certificate column
            $certificatePath = 'public/images/wallpapersden.jpg';
            if (Storage::exists($certificatePath)) {
                $program->certificate = $certificatePath;
            }

            $program->save();
        }
    }
}
