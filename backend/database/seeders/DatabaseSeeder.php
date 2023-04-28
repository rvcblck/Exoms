<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\UserTableSeeder;
use Database\Seeders\ProgramTableSeeder;
use Database\Seeders\MemberTableSeeder;
use Database\Seeders\LeaderSeeder;
use Database\Seeders\PartnerTableSeeder;
use Database\Seeders\RelationTableSeeder;
use Database\Seeders\ContractTableSeeder;
use Database\Seeders\ParticipantTableSeeder;
use Database\Seeders\AdminAccountSeeder;
use Database\Seeders\UserSeeeder;



// use Database\Seeders\AttendanceTableSeeder;



class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(UserTableSeeder::class);
        $this->call(UserSeeeder::class);
        $this->call(ProgramTableSeeder::class);
        $this->call(MemberTableSeeder::class);
        $this->call(PartnerTableSeeder::class);
        $this->call(RelationTableSeeder::class);
        $this->call(ContractTableSeeder::class);
        $this->call(ParticipantTableSeeder::class);
        $this->call(LeaderSeeder::class);
        $this->call(AdminAccountSeeder::class);
        $this->call(TopicTableSeeder::class);
        $this->call(FlowTableSeeder::class);

        $this->call(AttendanceTableSeeder::class);
    }
}
