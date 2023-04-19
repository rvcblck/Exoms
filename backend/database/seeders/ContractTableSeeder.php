<?php

namespace Database\Seeders;
use App\Models\Contract;
use App\Models\Partner;

use Faker\Factory as Faker;

use Illuminate\Database\Seeder;

class ContractTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();

        // Get all programs
        $partnerIds = Partner::all();

        // Loop through each program and create certificates
        foreach ($partnerIds as $partnerId) {
            // Generate a random number of certificates (1-2)
            $numPrograms = rand(1,2);
            for($i = 0; $i < $numPrograms; $i++ ){
                $startDate = $faker->dateTimeBetween('-1 year', '+1 year');

                $certificate = new Contract;
                $certificate->contract_id =  $this->generateContractId();
                $certificate->partner_id = $partnerId->partner_id;
                $certificate->start_date = $startDate;
                $certificate->end_date = (clone $startDate)->modify('+1 year');
                $certificate->save();
            }



        }
    }
    public function generateContractId() {
        $contract = 'CTRCT-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
        $existing_contract = Contract::where('contract_id', $contract)->first();
        while($existing_contract) {
            $contract = 'CTRCT-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
            $existing_contract = Contract::where('contract_id', $contract)->first();
        }
        return $contract;
    }
}
