<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\PartnerController;
use App\Http\Controllers\ProfileController;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\File;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });



// Authentication
Route::post('/verify-email', [VerificationController::class, 'verifyEmail']);
Route::post('/send-email', [VerificationController::class, 'sendEmail']);


Route::post('/email/resend-verification-code',[AuthController::class, 'resendCode']);
Route::post('/forgot-password',[AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::get('/reset-password/{token}', [AuthController::class, 'checkResetToken']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);





Route::middleware('jwt','verified')->group(function () {


    Route::post('/logout', [AuthController::class, 'logout']);
});


// Account Management

Route::post('/accounts', [AccountController::class, 'store']);
Route::get('/accounts/{id}', [AccountController::class, 'show']);
Route::put('/accounts/{id}', [AccountController::class, 'update']);
Route::delete('/accounts/{id}', [AccountController::class, 'destroy']);
Route::post('/approve-accounts', [AccountController::class, 'approveAccount']);
Route::post('/disapprove-accounts', [AccountController::class, 'disapproveAccount']);
Route::get('/accountInfo/{id}', [AccountController::class, 'accountInfo']);

Route::post('/create-programs', [ProgramController::class, 'createProgram']);
Route::post('/update-programs', [ProgramController::class, 'updateProgram']);

    Route::get('/programInfo/{id}', [ProgramController::class, 'programInfo']);

    // Route::get('/partners', [PartnerController::class, 'index']);
    Route::get('/programs', [ProgramController::class, 'index']);
    Route::get('/partnerInfo/{id}', [PartnerController::class, 'partnerInfo']);
    Route::get('/partners', [PartnerController::class, 'index']);
    Route::post('/create-partner', [PartnerController::class, 'createPartner']);
    Route::post('/update-partner', [PartnerController::class, 'updatePartner']);
    Route::get('/accounts', [AccountController::class, 'index']);
Route::get('/profileInfo/{id}', [ProfileController::class, 'index']);
Route::get('/userPrograms/{id}', [ProgramController::class, 'userProgram']);
Route::get('/autoComplete',[ProgramController::class, 'AutoComplete']);


Route::get('/attendance/{id}',[ProgramController::class, 'attendance']);
Route::post('/store-attendance',[ProgramController::class, 'storeAttendance']);

Route::get('/images/{filename}',[ImageController::class, 'getImage']);


Route::get('/download-file/{id}',[ImageController::class, 'downloadFile'])->middleware('cors');

Route::get('/download-certfile/{id}',[ImageController::class, 'downloadCertFile'])->middleware('cors');
Route::get('/download-moa/{id}',[ImageController::class, 'downloadMoa'])->middleware('cors');

Route::post('/file',[ImageController::class, 'getUserFiles'])->middleware('cors');

Route::get('/view-file/{filePath}',[ImageController::class, 'viewUserFiles']);

Route::post('/program-file',[ImageController::class,'getProgramFiles'])->middleware('cors');




























