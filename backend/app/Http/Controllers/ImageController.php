<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use App\Models\Program;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class ImageController extends Controller
{
    public function getImage($filename)
    {



        $path = public_path('storage' . DIRECTORY_SEPARATOR . $filename);
        if (!File::exists($path)) {
            dd('wala');
            abort(404);
        }
        $file = File::get($path);
        $type = File::mimeType($path);
        $response = new Response($file, 200);
        $response->header("Content-Type", $type);
        return $response;
    }

    public function getUserFiles(Request $request)
    {

        $path = public_path('storage' . DIRECTORY_SEPARATOR . $request->filePath);
        if (!File::exists($path)) {
            abort(404);
        }

        $file = File::get($path);
        $type = File::mimeType($path);

        $response = new Response($file, 200);
        $response->header("Content-Type", $type);
        $response->header("Content-Disposition", "attachment; filename=\"" . basename($path) . "\"");



        return $response;
    }

    public function viewUserFiles($filePath)
    {

        $path = public_path('storage' . DIRECTORY_SEPARATOR . $filePath);
        if (!File::exists($path)) {
            abort(404);
        }

        $viewFile = [
            'fileName' => basename($path),
            'fileExtension' => pathinfo($path, PATHINFO_EXTENSION),
            'fileSize' => filesize($path),
        ];

        return response()->json($viewFile);
    }

    public function getProgramFiles(Request $request)
    {

        $path = public_path('storage' . DIRECTORY_SEPARATOR . $request->filePath);

        if (!File::exists($path)) {
            abort(404);
        }

        $viewFile = [
            'fileName' => basename($path),
            'fileExtension' => pathinfo($path, PATHINFO_EXTENSION),
            'fileSize' => filesize($path),
        ];

        return response()->json($viewFile);
    }

    public function downloadFile($id)
    {
        $filePath = Program::where('program_id', $id)->first();

        $path = public_path('storage' . DIRECTORY_SEPARATOR . $filePath->invitation);
        if (!File::exists($path)) {
            abort(404);
        }

        $file = File::get($path);
        $type = File::mimeType($path);

        $response = new Response($file, 200);
        $response->header('Access-Control-Allow-Origin', '*');
        $response->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
        $response->header('Content-Type', $type);
        $response->header('Content-Disposition', 'attachment; filename="' . basename($path) . '"');
        return $response;
    }

    public function downloadCertFile($id)
    {
        $filePath = Program::where('program_id', $id)->first();
        $path = public_path('storage' . DIRECTORY_SEPARATOR . $filePath->certificate);
        if (!File::exists($path)) {
            abort(404);
        }

        $file = File::get($path);
        $type = File::mimeType($path);

        $response = new Response($file, 200);
        $response->header('Access-Control-Allow-Origin', '*');
        $response->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
        $response->header('Content-Type', $type);
        $response->header('Content-Disposition', 'attachment; filename="' . basename($path) . '"');
        return $response;
    }

    

    public function downloadMoa($id)
    {
        $filePath = Partner::where('partner_id', $id)->first();

        $path = public_path('storage' . DIRECTORY_SEPARATOR . $filePath->moa_file);
        if (!File::exists($path)) {
            abort(404);
        }

        $file = File::get($path);
        $type = File::mimeType($path);
        $response = new Response($file, 200);
        $response->header('Access-Control-Allow-Origin', '*');
        $response->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
        $response->header('Content-Type', $type);
        return $response;
    }
}
