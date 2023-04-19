<?php

namespace Database\Seeders;
use App\Models\Partner;
use App\Models\Program;
use App\Models\Relation;
use Faker\Factory as Faker;

use Illuminate\Database\Seeder;

class RelationTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $program_ids = Program::pluck('program_id')->toArray();
        $partner_ids = Partner::pluck('partner_id')->toArray();
        $faker = Faker::create('PH');

        foreach($program_ids as $program_id){
            $numPartners = rand(1, 2);

            $samplePartnerIds = (array) array_rand($partner_ids, $numPartners);


            foreach($samplePartnerIds as $samplePartnerId){
                Relation::create([
                    'program_id' => $program_id,
                    'partner_id' => $partner_ids[$samplePartnerId],
                ]);
            }
        }


    }


}
