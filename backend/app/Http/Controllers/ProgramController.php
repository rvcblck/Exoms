<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Program;
use App\Models\Participant;
use App\Models\Member;
use App\Models\Flow;
use App\Models\User;
use App\Models\Partner;
use App\Models\Relation;
use App\Models\Contract;
use App\Models\Position;
use App\Models\Topic;
use Attribute;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use SendinBlue\Client\Model\Contact;



class ProgramController extends Controller
{
    public function index()
    {


        $now = Carbon::now('Asia/Manila');

        $programData = [];

        $programs = Program::with('participants', 'users', 'members')->where('archived', false)->get();

        foreach ($programs as $program) {

            //participants numbers
            $participantCount = $program->participants()->count();


            // getting leader
            $leader = $program->members()->wherePivot('leader', true)->first();
            if ($leader) {
                $leaderData = [
                    'user_id' => $leader->user_id,
                    'fullName' => $leader->fname . ' ' . $leader->lname,
                ];
            }


            //status
            $endDate = Carbon::parse($program->end_date);
            $startDate = Carbon::parse($program->start_date);
            $status = '';
            if ($endDate->lt($now)) {
                $status = 'Previous';
            } else if ($startDate->gt($now)) {
                $status = 'Upcoming';
            } else {
                $status = 'Ongoing';
            }


            $programData[] = [
                'program_id' => $program->program_id,
                'title' => $program->title,
                'details' => $program->details,
                'place' => $program->place,
                'start_date' => $program->start_date,
                'end_date' => $program->end_date,
                'participant_count' => $participantCount,
                'status' => $status,
                'leader' => $leaderData

            ];
        }

        return response()->json($programData);
    }

    public function getArchives()
    {


        $now = Carbon::now('Asia/Manila');

        $programData = [];

        $programs = Program::with('participants', 'users', 'members')->where('archived', true)->get();

        foreach ($programs as $program) {

            //participants numbers
            $participantCount = $program->participants()->count();


            // getting leader
            $leader = $program->members()->wherePivot('leader', true)->first();
            if ($leader) {
                $leaderData = [
                    'user_id' => $leader->user_id,
                    'fullName' => $leader->fname . ' ' . $leader->lname,
                ];
            }


            //status
            $endDate = Carbon::parse($program->end_date);
            $startDate = Carbon::parse($program->start_date);
            $status = '';
            if ($endDate->lt($now)) {
                $status = 'Previous';
            } else if ($startDate->gt($now)) {
                $status = 'Upcoming';
            } else {
                $status = 'Ongoing';
            }


            $programData[] = [
                'program_id' => $program->program_id,
                'title' => $program->title,
                'details' => $program->details,
                'place' => $program->place,
                'start_date' => $program->start_date,
                'end_date' => $program->end_date,
                'participant_count' => $participantCount,
                'status' => $status,
                'leader' => $leaderData

            ];
        }

        return response()->json($programData);
    }




    public function programInfo($id)
    {

        $now = Carbon::now('Asia/Manila');

        $programData = [];

        $program = Program::with('participants', 'users', 'members', 'partners')->where('program_id', $id)->first();

        $participantCount = $program->participants()->count();

        //participants numbers
        $participantData = [];
        $participants = $program->participants()->get();
        foreach ($participants as $participant) {

            $participantData[] = [
                'participant_id' => $participant->participant_id,
                'name' => $participant->name,
            ];
        }


        //getting members
        $users = $program->users()->wherePivot('leader', null)->get();
        $userData = [];
        foreach ($users as $user) {

            $userData[] = [
                'user_id' => $user->user_id,
                'fullName' => $user->fname . ' ' . $user->mname . ' ' . $user->lname . '  ' . $user->suffix,

            ];
        }

        //getting leader
        $leader = $program->members()->wherePivot('leader', true)->first();
        $leaderData = [
            'user_id' => $leader->user_id,
            'fullName' => $leader->fname . ' ' . $leader->mname . ' ' . $leader->lname . ' ' . $leader->suffix,
        ];



        //getting partner
        $partnerData = [];
        $partners = $program->partners()->get();
        foreach ($partners as $partner) {

            $contracts = Contract::where('partner_id', $partner->partner_id)->get();
            $contractData = [];
            foreach ($contracts as $contract) {
                $contractData[] = [
                    'contract_id' => $contract->contract_id,
                    'start_date' => $contract->start_date,
                    'end_date' => $contract->end_date
                ];
            }


            $partnerData[] = [
                'partner_id' => $partner->partner_id,
                'name' => $partner->company_name,
                'address' => $partner->address,
                'contact_no' => $partner->contact_no,
                'contact_person' => $partner->contact_person,
                'moa_file' => $partner->moa_file,
                'contract' => $contractData
            ];
        }


        $invViewFile = [];
        if ($program->invitation) {
            // $invpath = storage_path('app\public\\' . $program->invitation);
            $invpath = public_path('storage' . DIRECTORY_SEPARATOR . $program->invitation);
            if (!File::exists($invpath)) {
                abort(404);
            }

            $invViewFile = [
                // 'fileName' => basename($invpath),
                // 'fileExtension' => pathinfo($invpath, PATHINFO_EXTENSION),
                // 'fileSize' => filesize($invpath),
                'fileName' => pathinfo($invpath, PATHINFO_FILENAME),
                'fileExtension' => pathinfo($invpath, PATHINFO_EXTENSION),
                'fileSize' => filesize($invpath),
            ];
        }


        $certViewFile = [];
        if ($program->certificate) {
            // $certpath = storage_path('app\public\\' . $program->certificate);
            $certpath = public_path('storage' . DIRECTORY_SEPARATOR . $program->certificate);
            if (!File::exists($certpath)) {
                abort(404);
            }

            $certViewFile = [
                // 'fileName' => basename($certpath),
                // 'fileExtension' => pathinfo($certpath, PATHINFO_EXTENSION),
                // 'fileSize' => filesize($certpath),
                'fileName' => pathinfo($certpath, PATHINFO_FILENAME),
                'fileExtension' => pathinfo($certpath, PATHINFO_EXTENSION),
                'fileSize' => filesize($certpath),
            ];
        }




        //status
        $endDate = Carbon::parse($program->end_date);
        $startDate = Carbon::parse($program->start_date);
        $status = '';
        if ($endDate->lt($now)) {
            $status = 'Previous';
        } else if ($startDate->gt($now)) {
            $status = 'Upcoming';
        } else {
            $status = 'Ongoing';
        }


        $programData[] = [
            'program_id' => $program->program_id,
            'title' => $program->title,
            'details' => $program->details,
            'place' => $program->place,
            'start_date' => $program->start_date,
            'end_date' => $program->end_date,
            'start_time' => $program->start_time,
            'end_time' => $program->end_time,
            'status' => $status,
            'certificate' => $program->certificate,
            'invitation' => $program->invitation,
            'leader' => $leaderData,
            'members' => $userData,
            'partners' => $partnerData,
            'participants' => $participantData,
            'participant_count' => $participantCount,
            'invitation_content' => $invViewFile,
            'certificate_content' => $certViewFile,




        ];



        // $certViewFile = [];
        // if ($program->certificate) {
        //     $certpath = storage_path('app\public\\' . $program->certificate);
        //     if (!File::exists($certpath)) {
        //         abort(404);
        //     }

        //     $certViewFile = [
        //         'fileName' => basename($certpath),
        //         'fileExtension' => pathinfo($certpath, PATHINFO_EXTENSION),
        //         'fileSize' => filesize($certpath),
        //     ];
        // }




        // //status
        // $endDate = Carbon::parse($program->end_date);
        // $startDate = Carbon::parse($program->start_date);
        // $status = '';
        // if ($endDate->lt($now)) {
        //     $status = 'Previous';
        // } else if ($startDate->gt($now)) {
        //     $status = 'Upcoming';
        // } else {
        //     $status = 'Ongoing';
        // }


        // $programData[] = [
        //     'program_id' => $program->program_id,
        //     'title' => $program->title,
        //     'details' => $program->details,
        //     'place' => $program->place,
        //     'start_date' => $program->start_date,
        //     'end_date' => $program->end_date,
        //     'status' => $status,
        //     'certificate' => $program->certificate,
        //     'invitation' => $program->invitation,
        //     'leader' => $leaderData,
        //     'members' => $userData,
        //     'partners' => $partnerData,
        //     'participants' => $participantData,
        //     'participant_count' => $participantCount,
        //     'invitation_content' => $invViewFile,
        //     'certificate_content' => $certViewFile,



        // ];




        $new_data = array_values($programData); // convert associative array to indexed array

        return response()->json(array_shift($new_data));
    }




    public function createProgram(Request $request)
    {




        $rules = [
            'title' => 'required',
            'details' => 'required',
            'start_date' => 'required',
            'end_date' => 'required',
            'leader_id' => 'required',
            'member_id' => 'required',
            'address' => 'required',
            'invitation' => 'nullable|mimes:pdf,docx,png,jpeg|max:5048',
            'certificate' => 'nullable|mimes:pdf,docx,png,jpeg|max:5048',
            'participant' => 'nullable',
            'partner_id' => 'required',
            'start_time' => 'nullable',
            'end_time' => 'nullable',
        ];

        $messages = [
            'title.required' => 'Title is required.',
            'details.required' => 'Details are required.',
            'start_date.required' => 'Start date is required.',
            'start_date.date' => 'Start date must be a valid date.',
            'end_date.required' => 'End date is required.',
            'end_date.date' => 'End date must be a valid date.',
            'end_date.after_or_equal' => 'End date must be after or equal to the start date.',
            'leader_id.required' => 'Leader is required.',
            'member_id.required' => 'At least one member is required.',
            'invitation.mimes' => 'The :attribute must be a pdf, docx, png, or jpeg file.',
            'invitation.max' => 'Invitation file may not be greater than 5MB.',
            'certificate.mimes' => 'The :attribute must be a pdf, docx, png, or jpeg file.',
            'certificate.max' => 'Certificate file may not be greater than 5MB.',
            'partner_id.required' => 'Partner is required.',

        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }


        $start_dateString = $request->input('start_date');
        $start_date = Carbon::parse($start_dateString)->toDateString();

        $end_dateString = $request->input('end_date');
        $end_date = Carbon::parse($end_dateString)->toDateString();
        //create path
        $program_id = $this->generateProgramId();

        $start_time = null;
        if ($request->input('start_time')) {
            $start_timeString = $request->input('start_time');
            $start_time = Carbon::parse($start_timeString)->toTimeString();
        }
        $end_time = null;
        if ($request->input('end_time')) {
            $end_timeString = $request->input('end_time');
            $end_time = Carbon::parse($end_timeString)->toTimeString();
        }







        // store file
        $path_invitation = '';
        $invitation = $request->file('invitation');
        if (!empty($invitation)) {
            $filename = $invitation->getClientOriginalName();
            $new_filename = 'Inv_' . $filename;
            $path_invitation = Storage::putFileAs('program/' . $program_id, $invitation, $new_filename);
        }

        $path_certificate = '';
        $certificate = $request->file('certificate');
        if (!empty($certificate)) {
            $filename = $certificate->getClientOriginalName();
            $new_filename = 'Cert_' . $filename;
            $path_certificate = Storage::putFileAs('program/' . $program_id, $certificate, $new_filename);
        }

        $title = $request->input('title');
        $address = $request->input('address');
        $details = $request->input('details');

        Program::create([
            'program_id' => $program_id,
            'title' => $title,
            'start_date' => $start_date,
            'end_date' => $end_date,
            'start_time' => $start_time,
            'end_time' => $end_time,
            'place' => $address,
            'details' =>  $details,
            'certificate' => $path_certificate,
            'invitation' => $path_invitation,
        ]);


        // for member


        if (!empty($request->member_id)) {
            // $memberIds = $request->input('member_id');
            $memberIds = explode(',', $request->member_id);

            foreach ($memberIds as $memberId) {
                Member::create([
                    'program_id' => $program_id,
                    'user_id' => $memberId,
                ]);
            }
        }

        //for leader
        Member::create([
            'program_id' => $program_id,
            'user_id' => $request->leader_id,
            'leader' => true

        ]);




        if (!empty($request->participant)) {
            // $participants = $request->input('participant');
            $participants = explode(',', $request->participant);
            foreach ($participants as $participant) {
                $participant_id = $this->generateParticipantId();
                Participant::create([
                    'participant_id' => $participant_id,
                    'program_id' => $program_id,
                    'name' => $participant,

                ]);
            }
        }



        if (!empty($request->partner_id)) {
            // $partners = $request->input('partner_id');
            $partners = explode(',', $request->partner_id);
            foreach ($partners as $partner) {
                Relation::create([
                    'program_id' => $program_id,
                    'partner_id' => $partner
                ]);
            }
        }





        return response()->json([
            'success' => true,
            'message' => 'Program Created'
        ]);
    }




    public function updateProgram(Request $request)
    {




        $rules = [
            'title' => 'required',
            'details' => 'required',
            'start_date' => 'required',
            'end_date' => 'required',
            'leader_id' => 'required',
            'member_id' => 'required',
            'address' => 'required',
            'invitation' => 'nullable|mimes:pdf,docx,png,jpeg,jpg|max:5048',
            'certificate' => 'nullable|mimes:pdf,docx,png,jpeg,jpg|max:5048',
            'participant' => 'nullable',
            'partner_id' => 'required',


        ];

        $messages = [
            'title.required' => 'Title is required.',
            'details.required' => 'Details are required.',
            'start_date.required' => 'Start date is required.',
            'start_date.date' => 'Start date must be a valid date.',
            'end_date.required' => 'End date is required.',
            'end_date.date' => 'End date must be a valid date.',
            'end_date.after_or_equal' => 'End date must be after or equal to the start date.',
            'leader_id.required' => 'Leader is required.',
            'member_id.required' => 'At least one member is required.',
            'invitation.mimes' => 'The :attribute must be a pdf, docx, png, or jpeg file.',
            'invitation.max' => 'Invitation file may not be greater than 5MB.',
            'certificate.mimes' => 'The :attribute must be a pdf, docx, png, or jpeg file.',
            'certificate.max' => 'Certificate file may not be greater than 5MB.',
            'partner_id.required' => 'Partner is required.',

        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }


        $start_dateString = $request->input('start_date');
        $start_date = Carbon::parse($start_dateString)->toDateString();

        $end_dateString = $request->input('end_date');
        $end_date = Carbon::parse($end_dateString)->toDateString();

        $start_time = null;
        if ($request->input('start_time')) {
            $start_timeString = $request->input('start_time');
            $start_time = Carbon::parse($start_timeString)->toTimeString();
        }
        $end_time = null;
        if ($request->input('end_time')) {
            $end_timeString = $request->input('end_time');
            $end_time = Carbon::parse($end_timeString)->toTimeString();
        }

        $invitation = $request->file('invitation');
        $certificate = $request->file('certificate');





        $path_invitation = '';
        if (!empty($invitation)) {
            // Get the program directory
            $programDir = 'program/' . $request->program_id;

            // Get all files in the program directory
            $files = Storage::files($programDir);

            // Loop through the files and delete the invitation file if it exists
            if ($files) {
                foreach ($files as $file) {
                    if (Str::startsWith($file, $programDir . '/Inv_')) {
                        Storage::delete($file);
                    }
                }
            }


            $filename = $invitation->getClientOriginalName();
            $new_filename = 'Inv_' . $filename;
            $path_invitation = Storage::putFileAs('program/' . $request->program_id, $invitation, $new_filename);
        }


        $path_certificate = '';
        if (!empty($certificate)) {
            // Get the program directory
            $programDir = 'program/' . $request->program_id;

            // Get all files in the program directory
            $files = Storage::files($programDir);

            // Loop through the files and delete the invitation file if it exists
            if ($files) {
                foreach ($files as $file) {
                    if (Str::startsWith($file, $programDir . '/Cert_')) {
                        Storage::delete($file);
                    }
                }
            }


            $filename = $certificate->getClientOriginalName();
            $new_filename = 'Cert_' . $filename;
            $path_certificate = Storage::putFileAs('program/' . $request->program_id, $certificate, $new_filename);
        }


        $title = $request->input('title');
        $address = $request->input('address');
        $leaderId = $request->input('leader_id');
        $details = $request->input('details');

        $updates = [
            'title' => $title,
            'start_date' => $start_date,
            'end_date' => $end_date,
            // 'start_time' => $start_time,
            // 'end_time' => $end_time,
            'place' => $address,
            'details' => $details,
        ];
        if ($start_time) {
            $updates['start_time'] = $start_time;
        } else {
            $updates['start_time'] = null;
        }

        if ($end_time) {
            $updates['end_time'] = $end_time;
        } else {
            $updates['end_time'] = null;
        }

        if (!empty($path_certificate)) {
            $updates['certificate'] = $path_certificate;
        }

        if (!empty($path_invitation)) {
            $updates['invitation'] = $path_invitation;
        }

        Program::where('program_id', $request->program_id)->update(array_filter($updates));



        // for member

        if (!empty($request->member_id)) {
            Member::where('program_id', $request->program_id)->delete();
        }


        if (!empty($request->member_id)) {
            // $memberIds = $request->input('member_id');
            $memberIds = explode(',', $request->member_id);
            // dd($memberIds);
            foreach ($memberIds as $memberId) {
                Member::create([
                    'program_id' => $request->program_id,
                    'user_id' => $memberId,
                ]);
            }
        }

        //for leader
        Member::create([
            'program_id' => $request->program_id,
            'user_id' => $request->leader_id,
            'leader' => true

        ]);


        if (!empty($request->participant)) {
            Participant::where('program_id', $request->program_id)->delete();
        }


        if (!empty($request->participant)) {
            // $participants = $request->input('participant');
            $participants = explode(',', $request->participant);
            foreach ($participants as $participant) {
                $participant_id = $this->generateParticipantId();
                Participant::create([
                    'participant_id' => $participant_id,
                    'program_id' => $request->program_id,
                    'name' => $participant,

                ]);
            }
        }

        if (!empty($request->participant)) {
            Relation::where('program_id', $request->program_id)->delete();
        }

        if (!empty($request->partner_id)) {
            // $partners = $request->input('partner_id');
            $partners = explode(',', $request->partner_id);
            foreach ($partners as $partner) {
                Relation::create([
                    'program_id' => $request->program_id,
                    'partner_id' => $partner
                ]);
            }
        }





        return response()->json([
            'success' => true,
            'message' => 'Program Updated'
        ]);
    }

    public function AutoComplete()
    {
        $now = Carbon::now('Asia/Manila');
        $usersData = [];
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


            $usersData[] = [
                'user_id' => $user->user_id,
                'fname' => $user->fname,
                'lname' => $user->lname,
                'mname' => $user->mname,
                'suffix' => $user->suffix,
                'ongoing' => $ongoing,
                'upcoming' => $upcoming,
            ];
        }

        $partnersData = [];
        $partners = Partner::get();
        foreach ($partners as $partner) {
            $partnersData[] = [
                'partner_id' => $partner->partner_id,
                'name' => $partner->company_name,
            ];
        }

        $new_data = [
            'users' => $usersData,
            'partners' => $partnersData
        ];


        return response()->json($new_data);
    }


    public function userProgram($id)
    {
        $now = Carbon::now('Asia/Manila');

        $programData = [];

        $user = User::with('programs', 'members')->where('user_id', $id)->get()->first();



        $programs = $user->programs()->get();



        foreach ($programs as $program) {

            //participants numbers
            $participantCount = $program->participants()->count();


            // getting leader
            $leader = $program->members()->wherePivot('leader', true)->first();
            if ($leader) {
                $leaderData = [
                    'user_id' => $leader->user_id,
                    'fullName' => $leader->fname . ' ' . $leader->mname . ' ' . $leader->lname . ' ' . $leader->suffix,
                ];
            }



            //status
            $endDate = Carbon::parse($program->end_date);
            $startDate = Carbon::parse($program->start_date);
            $status = '';
            if ($endDate->lt($now)) {
                $status = 'Previous';
            } else if ($startDate->gt($now)) {
                $status = 'Upcoming';
            } else {
                $status = 'Ongoing';
            }


            $programData[] = [
                'program_id' => $program->program_id,
                'title' => $program->title,
                'details' => $program->details,
                'place' => $program->place,
                'start_date' => $program->start_date,
                'end_date' => $program->end_date,
                'participant_count' => $participantCount,
                'status' => $status,
                'leader' => $leaderData,

            ];
        }

        return response()->json($programData);
    }

    public function attendance($id)
    {


        $participants = Participant::with('attendance')->where('program_id', $id)->get();
        $participantData = [];
        foreach ($participants as $participant) {
            $attendanceData = [];

            $attendance = Attendance::where('participant_id', $participant->participant_id)->get();

            if (!$attendance->isEmpty()) {
                foreach ($attendance as $attendee) {
                    $attendanceData[] = [
                        'attendance_id' => $attendee->attendance_id,
                        'date' => $attendee->date,
                        'status' => $attendee->status
                    ];
                }
            }


            $participantData[] = [
                'participant_id' => $participant->participant_id,
                'name' => $participant->name,
                'attendance' => $attendanceData
            ];
        }


        return response()->json($participantData);
    }

    public function storeAttendance(Request $request)
    {

        foreach ($request->all() as $participant) {
            foreach ($participant['dates'] as $date) {
                $participant_id = $participant['participant_id'];
                $participantDate = Carbon::createFromFormat('Y-m-d', $date['date']);;
                $status = $date['status'];



                $isSet = Attendance::where('participant_id', $participant_id)
                    ->where('date', $date['date'])->first();
                if ($isSet !== null) {
                    Attendance::where('participant_id', $participant_id)
                        ->where('date', $date['date'])->update([
                            'status' => $status
                        ]);
                } else {
                    Attendance::create([
                        'attendance_id' => $this->generateAttendanceId(),
                        'participant_id' => $participant_id,
                        'date' => $participantDate,
                        'status' => $status
                    ]);
                }
            }
        }
    }


    public function programFlow($program_id)
    {
        $flows = Flow::where('program_id', $program_id)->get();

        $flowData = [];
        foreach ($flows as $flow) {
            $flowData[] = [
                'flow' => $flow->flow,
                'description' => $flow->description,
            ];
        }


        $topics = Topic::where('program_id', $program_id)->get();

        $topicData = [];
        foreach ($topics as $topic) {
            $topicData[] = [
                'col_1' => $topic->col_1,
                'col_2' => $topic->col_2,
                'col_3' => $topic->col_3,
            ];
        }




        $program = Program::with('users', 'members',)->where('program_id', $program_id)->first();
        $users = $program->users()->withPivot('position')->get();
        $userData = [];
        foreach ($users as $user) {

            $userData[] = [
                'name' => $user->fname . ' ' . $user->mname . ' ' . $user->lname . '  ' . $user->suffix,
                'position' => $user->pivot->position,
                'user_id' => $user->user_id
            ];
        }



        $otherDetails = [
            'flow' => $flowData,
            'topic' => $topicData,
            'position' => $userData
        ];






        return response()->json($otherDetails);
    }

    public function updateProgramFlow(Request $request)
    {
        $programId = $request->program_id;

        // delete all data in the "flow" table with the given program_id
        Flow::where('program_id', $programId)->delete();

        // insert new records for each item in the "data" array
        foreach ($request->data as $item) {
            Flow::create([
                'program_id' => $programId,
                'flow_id' => $this->generateflowId(),
                'flow' => $item['flow'],
                'description' => $item['description'],
            ]);
        }

        return response()->json(['message' => 'Program flow updated successfully.']);
    }

    public function updateProgramTopic(Request $request)
    {
        $programId = $request->program_id;

        // delete all data in the "flow" table with the given program_id
        Topic::where('program_id', $programId)->delete();

        // insert new records for each item in the "data" array
        foreach ($request->data as $item) {
            Topic::create([
                'topic_id' => $this->generateTopicId(),
                'program_id' => $programId,
                'col_1' => $item['col_1'],
                'col_2' => $item['col_2'],
                'col_3' => $item['col_3'],
            ]);
        }

        return response()->json(['message' => 'Program topic updated successfully.']);
    }


    public function updateProgramPosition(Request $request)
    {
        $program_id = $request->input('program_id');
        $data = $request->input('data');

        foreach ($data as $member) {
            Member::where('program_id', $program_id)
                ->where('user_id', $member['user_id'])
                ->update(['position' => $member['position']]);
        }

        return response()->json(['message' => 'Positions updated successfully']);
    }




    public function archiveProgram($program_id)
    {
        $program = Program::where('program_id', $program_id)->first();

        if ($program) {
            $program->archived = true;
            $program->save();
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Program ID not found',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Program archive successfuly',
        ]);
    }

    public function unarchivedProgram(Request $request)
    {
        $program_ids = $request->input('program_ids');
        foreach ($program_ids as $program_id) {
            $program = Program::where('program_id', $program_id)->first();
            if ($program) {
                $program->archived = false;
                $program->save();
            }
        }
        return response()->json([
            'success' => true,
            'message' => 'Program unarchived successfully',
        ]);
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






    public function generateProgramId()
    {
        $program_id = 'PROG-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
        $existing_program_id = Program::where('program_id', $program_id)->first();
        while ($existing_program_id) {
            $program_id = 'PROG-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
            $existing_program_id = Program::where('program_id', $program_id)->first();
        }
        return $program_id;
    }


    public function generateParticipantId()
    {
        $participant_id = 'PART-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
        $existing_participant_id = Participant::where('participant_id', $participant_id)->first();
        while ($existing_participant_id) {
            $participant_id = 'PART-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
            $existing_participant_id = Participant::where('participant_id', $participant_id)->first();
        }
        return $participant_id;
    }

    public function generateAttendanceId()
    {
        $attendance_id = 'ATT-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
        $existing_attendance_id = Attendance::where('attendance_id', $attendance_id)->first();
        while ($existing_attendance_id) {
            $attendance_id = 'ATT-' . str_pad(mt_rand(1, 9999999999), 10, '0', STR_PAD_LEFT);
            $existing_attendance_id = Attendance::where('attendance_id', $attendance_id)->first();
        }
        return $attendance_id;
    }
}
