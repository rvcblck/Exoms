<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Program;
use App\Models\Partner;
use App\Models\Relation;
use App\Models\Contract;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;


class PartnerController extends Controller
{
    // public function getAllPartners(){
    //     $partners = Partner::get();

    //     return response()->json($partners);
    // }

    public function index()
    {
        $partnerData = [];

        $partners = Partner::with('contracts', 'programs')->get();


        foreach ($partners as $partner) {

            $contract = $partner->contracts()->latest()->first();

            $contractsData = [];

            if ($contract) {
                $contractsData = [
                    'contract_id' => $contract->contract_id,
                    'start_date' => $contract->start_date,
                    'end_date' => $contract->end_date,    ];
            }


            $partnerData[] = [
                'partner_id' => $partner->partner_id,
                'company_name' => $partner->company_name,
                'address' => $partner->address,
                'contact_no' => $partner->contact_no,
                'contact_person' => $partner->contact_person,
                'moa_file' => $partner->moa_file,
                'contracts' => $contractsData,
            ];
        }

        return response()->json($partnerData);
    }




    public function partnerInfo($id)
    {
        $partnerData = [];

        $partner = Partner::with('contracts', 'programs')->where('partner_id',$id)->first();

            $contractsData = [];
            $contracts = $partner->contracts()->get();
                foreach($contracts as $contract){
                    $contractsData [] = [
                        'contract_id' => $contract->contract_id,
                        'start_date' => $contract->start_date,
                        'end_date' => $contract->end_date,
                    ];
                }

            $programData = [];
            $programs = $partner->programs()->get();
                foreach($programs as $program){
                    $programData [] = [
                        'program_id' => $program->program_id,
                        'title' => $program->title
                    ];
            }

            $path = storage_path('app\public\\'.$partner->moa_file);
            if (!File::exists($path)) {
                abort(404);
            }

            $moaData = [
                'fileName' => pathinfo($path, PATHINFO_FILENAME),
                'fileExt' => pathinfo($path, PATHINFO_EXTENSION),
                'fileSize' => filesize($path),
            ];



            $partnerData = [
                'partner_id' => $partner->partner_id,
                'company_name' => $partner->company_name,
                'address' => $partner->address,
                'contact_no' => $partner->contact_no,
                'contact_person' => $partner->contact_person,
                'moa_file' => $partner->moa_file,
                'contracts' => $contractsData,
                'programs' => $programData,
                'moaFile_content' => $moaData,
            ];


        return response()->json($partnerData);
    }

    public function createPartner(Request $request){
        $rules = [
            'company_name' => 'required',
            'address' => 'required',
            'start_date' => 'required',
            'end_date' => 'required',
            'contact_no' => 'required',
            'contact_person' => 'nullable',
            'address' => 'required',
            'moa_file' => 'required|mimes:pdf,docx|max:5048',
        ];

        $messages = [
            'company_name.required' => 'company is required.',
            'address.required' => 'address is required.',
            'start_date.required' => 'Start date is required.',
            'end_date.required' => 'End date is required.',
            'contact_no.required' => 'contact_no is required.',
            'contact_person.required' => 'contact_person is required',
            'moa_file.mimes' => 'The :attribute must be a pdf, docx file.',
            'moa_file.max' => 'moa_file file may not be greater than 5MB.',


        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }




        // string to date
        $start_dateString = $request->input('start_date');
        $start_date = Carbon::parse($start_dateString)->toDateString();

        $end_dateString = $request->input('end_date');
        $end_date = Carbon::parse($end_dateString)->toDateString();

        $partner_id = $this->generatePartnerId();

        // save file and make path
        Storage::makeDirectory('public/partner/' . $partner_id);



        $path_moaFile = '';
        $moa_file = $request->file('moa_file');
        if(!empty($moa_file)){
            $filename = $moa_file->getClientOriginalName();
            $new_filename = 'MOA_' . $filename;
            $path_moaFile = Storage::putFileAs('partner/'.$partner_id, $moa_file, $new_filename);
        }



        // save partner database


        Partner::create([
            'partner_id' => $partner_id,
            'company_name' => $request->company_name,
            'address' => $request->address,
            'contact_no' => $request->contact_no,
            'contact_person' => $request->contact_person,
            'moa_file' => $path_moaFile,

        ]);

        Contract::create([
            'partner_id' => $partner_id,
            'contract_id' => $this->generateContractId(),
            'start_date' => $start_date,
            'end_date' => $end_date
        ]);


        return response()->json([
            'success' => true,
            'message' => 'Partner Created'
        ]);
    }


    public function updatePartner(Request $request){
        $rules = [
            'company_name' => 'required',
            'address' => 'required',
            'start_date' => 'required',
            'end_date' => 'required',
            'contact_no' => 'required',
            'contact_person' => 'nullable',
            'address' => 'required',
            'moa_file' => 'mimes:pdf,docx|max:5048',
        ];

        $messages = [
            'company_name.required' => 'company is required.',
            'address.required' => 'address is required.',
            'start_date.required' => 'Start date is required.',
            'end_date.required' => 'End date is required.',
            'contact_no.required' => 'contact_no is required.',
            'contact_person.required' => 'contact_person is required',
            'moa_file.mimes' => 'The :attribute must be a pdf, docx file.',
            'moa_file.max' => 'moa_file file may not be greater than 5MB.',


        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }


        $start_dateString = $request->input('start_date');
        $start_date = Carbon::parse($start_dateString)->toDateString();

        $end_dateString = $request->input('end_date');
        $end_date = Carbon::parse($end_dateString)->toDateString();

        $moa_file = $request->file('moa_file');

        // save file and make path
        Storage::makeDirectory('public/partner/' . $request->partner_id);


        $path_moaFile = '';
        if(!empty($moa_file)){
            // Get the program directory
            $partnerDir = 'partner/' . $request->partner_id;

            // Get all files in the program directory
            $files = Storage::files($partnerDir);

            // Loop through the files and delete the invitation file if it exists
            foreach ($files as $file) {
                if (Str::startsWith($file, $partnerDir . '/MOA_')) {
                    Storage::delete($file);
                }
            }

            $filename = $moa_file->getClientOriginalName();
            $new_filename = 'MOA_' . $filename;
            $path_moaFile = Storage::putFileAs('partner/'.$request->partner_id, $moa_file, $new_filename);
        }



        // save partner database
        $updates = [
            'company_name' => $request->company_name,
            'address' => $request->address,
            'contact_no' => $request->contact_no,
            'contact_person' => $request->contact_person,
        ];

        if (!empty($path_moaFile)) {
            $updates['moa_file'] = $path_moaFile;
        }

        Partner::where('partner_id', $request->partner_id)->update(array_filter($updates));

        Contract::where('partner_id', $request->partner_id)->update([
            'start_date' => $start_date,
            'end_date' => $end_date
        ]);


        return response()->json([
            'success' => true,
            'message' => 'Partner Created'
        ]);
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



// $contracts = $partner->contracts->map(function ($contract) {
//     return [
//         'contract_id' => $contract->contract_id,
//         'start_date' => $contract->start_date,
//         'end_date' => $contract->end_date,
//     ];
// });
