<?php

namespace Database\Seeders;
use App\Models\Partner;
use App\Models\Program;
use Faker\Factory as Faker;

use Illuminate\Database\Seeder;

class PartnerTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */


    public function run()
    {
        $faker = Faker::create('PH');



        for ($i = 0; $i < 50; $i++) {
            Partner::create([
                'partner_id' => $this->generatePartnerId(),
                'company_name' => $faker->company,
                'address' => $faker->address,
                'contact_no' => $faker->phoneNumber,
                'contact_person' => $faker->firstName.' '.$faker->lastName,
                'moa_file' => $faker->word . '.pdf',
                // 'archived' => $faker->boolean(),
            ]);
        }
    }




    public function generateContractId() {
        $contract = 'CTRCT-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
        $existing_contract = Partner::where('contract_id', $contract)->first();
        while($existing_contract) {
            $contract = 'CTRCT-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
            $existing_contract = Partner::where('contract_id', $contract)->first();
        }
        return $contract;
    }
    public function generatePartnerId() {
        $partner_id = 'PRTNR-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
        $existing_partner_id = Partner::where('partner_id', $partner_id)->first();
        while($existing_partner_id) {
            $partner_id = 'PRTNR-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
            $existing_partner_id = Partner::where('partner_id', $partner_id)->first();
        }
        return $partner_id;
    }
}
