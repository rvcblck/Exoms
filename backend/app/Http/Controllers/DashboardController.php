<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\Partner;
use App\Models\Program;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $now = Carbon::now('Asia/Manila');
        $userData = [];

        $users = User::with('programs')->get();

        foreach ($users as $user) {
            $programs = $user->programs()->get();
            $ongoing = 0;
            $upcoming = 0;
            $previous = 0;

            foreach ($programs as $program) {
                $endDate = Carbon::parse($program->end_date);
                $startDate = Carbon::parse($program->start_date);
                if ($endDate->lt($now)) {
                    $previous++;
                } else if ($startDate->gt($now)) {
                    $upcoming++;
                } else {
                    $ongoing++;
                }
            }

            $total = $ongoing + $upcoming + $previous;

            $fullName = $user->fname . ' ' . $user->lname;

            $userData[] = [
                'user_id' => $user->user_id,
                'fullName' => $fullName,
                'email' => $user->email,
                'total' => $total
            ];
        }

        usort($userData, function ($a, $b) {
            return $b['total'] <=> $a['total'];
        });

        $userData = array_slice($userData, 0, 5);






        $allPrograms = Program::get();

        $allOngoing = 0;
        $allUpcoming = 0;
        $allPrevious = 0;


        foreach ($allPrograms as $allProgram) {

            $endDate = Carbon::parse($allProgram->end_date);
            $startDate = Carbon::parse($allProgram->start_date);
            if ($endDate->lt($now)) {
                $allPrevious++;
            } else if ($startDate->gt($now)) {
                $allUpcoming++;
            } else {
                $allOngoing++;
            }
        }

        $programData = [
            'ongoing' => $allOngoing,
            'upcoming' => $allUpcoming,
            'previous' => $allPrevious
        ];







        $approve = 0;
        $rejected = 0;
        $pending = 0;
        $disapprove = 1;

        $statusUsers = User::get();

        foreach ($statusUsers as $statusUser) {
            if ($statusUser->status === 'approve') {
                $approve++;
            } elseif ($statusUser->status === 'pending') {
                $pending++;
            } else {
                $rejected++;
            }
        }



        $statusData = [
            'approved' => $approve,
            'pending' => $pending,
            'disapproved' => $rejected,
        ];

        $statusDataTransformed = array_map(function ($key, $value) {
            return ['y' => $value, 'name' => ucfirst($key)];
        }, array_keys($statusData), $statusData);


        //where('end_date','2023-05-05')->
        $contracts = Contract::get();

        $expireData = [];

        foreach ($contracts as $contract) {
            $endDate1 = Carbon::parse($contract->end_date);
            $endDate2 = Carbon::parse($contract->end_date);


            $beforeEndDate = $endDate1->subMonth(1);




            if (($beforeEndDate->lt(now('Asia/Manila')) == true) && ($endDate2->gt(now('Asia/Manila')) == true)) {


                $partner = Partner::where('partner_id', $contract->partner_id)->first();

                $expireData[] = [
                    'partner_id' => $partner->partner_id,
                    'partner_name' => $partner->company_name,
                    'end_date' => $contract->end_date
                ];
            }
        }





        $dashboardData = [
            'program_count' => $programData,
            'faculty' => $userData,
            'user_status' => $statusDataTransformed,
            'expire_data' => $expireData

        ];













        return response()->json($dashboardData);
    }

    public function dashboardChart($month)
    {

        $year = date('Y'); // get the current year using now()

        // create a date object from the $month parameter
        $date = date_create_from_format('n', $month);

        // get the month in the format you need
        $month = date_format($date, 'm');

        // get the number of days in the given month and year
        $numDays = cal_days_in_month(CAL_GREGORIAN, $month, $year);

        $dataPoints = [];

        // loop through each day of the month
        for ($day = 1; $day <= $numDays; $day++) {
            // check if the day is odd
            if ($day % 2 != 0) {
                // format the date string as "Y-m-d"
                $dateString = sprintf('%04d-%02d-%02d', $year, $month, $day);
                // count the number of programs on that day (replace this with your own query)
                $programCount = Program::whereDate('start_date', '<=', $dateString)
                    ->whereDate('end_date', '>=', $dateString)
                    ->count();
                // add the data point to the array
                $dataPoints[] = [
                    'x' => $dateString,
                    'y' => $programCount
                ];
            }
        }

        return response()->json($dataPoints);
    }


    public function userDashboardChart($user_id)
    {
        $now = Carbon::now('Asia/Manila');
        $userData = [];


        $user1 = User::with('programs')->where('user_id', $user_id)->first();


        $programs = $user1->programs()->get();
        $ongoing = 0;
        $upcoming = 0;
        $previous = 0;


        foreach ($programs as $program) {
            $endDate = Carbon::parse($program->end_date);
            $startDate = Carbon::parse($program->start_date);
            if ($endDate->lt($now)) {
                $previous++;
            } else if ($startDate->gt($now)) {
                $upcoming++;
            } else {
                $ongoing++;
            }
        }

        $allPrograms = $user1->programs()->get();


        $allOngoing = 0;
        $allUpcoming = 0;
        $allPrevious = 0;


        foreach ($allPrograms as $allProgram) {

            $endDate = Carbon::parse($allProgram->end_date);
            $startDate = Carbon::parse($allProgram->start_date);
            if ($endDate->lt($now)) {
                $allPrevious++;
            } else if ($startDate->gt($now)) {
                $allUpcoming++;
            } else {
                $allOngoing++;
            }
        }

        $programData = [
            'ongoing' => $allOngoing,
            'upcoming' => $allUpcoming,
            'previous' => $allPrevious
        ];




        $users = User::with('programs')->get();

        foreach ($users as $user) {
            $programs = $user->programs()->get();
            $ongoing = 0;
            $upcoming = 0;
            $previous = 0;

            foreach ($programs as $program) {
                $endDate = Carbon::parse($program->end_date);
                $startDate = Carbon::parse($program->start_date);
                if ($endDate->lt($now)) {
                    $previous++;
                } else if ($startDate->gt($now)) {
                    $upcoming++;
                } else {
                    $ongoing++;
                }
            }

            $total = $ongoing + $upcoming + $previous;

            $fullName = $user->fname . ' ' . $user->lname;

            $userData[] = [
                'user_id' => $user->user_id,
                'fullName' => $fullName,
                'email' => $user->email,
                'total' => $total
            ];
        }

        usort($userData, function ($a, $b) {
            return $b['total'] <=> $a['total'];
        });

        $userData = array_slice($userData, 0, 5);



        $dashboardData = [
            'program_count' => $programData,
            'faculty' => $userData,

        ];



        return response()->json($dashboardData);
    }

    public function userProgramChart(Request $request)
    {


        $user = User::with('programs')->where('user_id', $request->user_id)->first();


        $year = date('Y'); // get the current year using now()

        // create a date object from the $month parameter
        $date = date_create_from_format('n', $request->month);

        // get the month in the format you need
        $month = date_format($date, 'm');

        // get the number of days in the given month and year
        $numDays = cal_days_in_month(CAL_GREGORIAN, $month, $year);

        $dataPoints = [];

        // loop through each day of the month
        for ($day = 1; $day <= $numDays; $day++) {
            // check if the day is odd
            if ($day % 2 != 0) {
                // format the date string as "Y-m-d"
                $dateString = sprintf('%04d-%02d-%02d', $year, $month, $day);
                // count the number of programs on that day (replace this with your own query)
                $programCount = $user->programs()->whereDate('start_date', '<=', $dateString)
                    ->whereDate('end_date', '>=', $dateString)
                    ->count();;

                $dataPoints[] = [
                    'x' => $dateString,
                    'y' => $programCount
                ];
            }
        }

        return response()->json($dataPoints);
    }
}
