<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\PartnerController;
use App\Http\Controllers\ProfileController;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\File;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;

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


Route::post('/email/resend-verification-code', [AuthController::class, 'resendCode']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::get('/reset-password/{token}', [AuthController::class, 'checkResetToken']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);





Route::middleware('jwt', 'verified')->group(function () {

    // Account Management
    Route::get('/accounts', [AccountController::class, 'index']);
    Route::get('/accountInfo/{id}', [AccountController::class, 'accountInfo']);
    Route::get('/select-accounts', [AccountController::class, 'selectAccount']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/accounts', [AccountController::class, 'store']);
    Route::get('/accounts/{id}', [AccountController::class, 'show']);
    Route::put('/accounts/{id}', [AccountController::class, 'update']);
    Route::delete('/accounts/{id}', [AccountController::class, 'destroy']);
    Route::post('/approve-accounts', [AccountController::class, 'approveAccount']);
    Route::post('/disapprove-accounts', [AccountController::class, 'disapproveAccount']);
    Route::post('/unarchived-account', [AccountController::class, 'unarchivedAccount']);
    Route::get('/archive-account/{user_id}', [AccountController::class, 'archiveAccount']);
    Route::get('/get-archive-accounts', [AccountController::class, 'getArchives']);


    //program Management
    Route::post('/create-programs', [ProgramController::class, 'createProgram']);
    Route::post('/update-programs', [ProgramController::class, 'updateProgram']);
    Route::get('/programInfo/{id}', [ProgramController::class, 'programInfo']);
    Route::get('/programs', [ProgramController::class, 'index']);
    Route::get('/userPrograms/{id}', [ProgramController::class, 'userProgram']);
    Route::get('/autoComplete', [ProgramController::class, 'AutoComplete']);
    Route::get('/attendance/{id}', [ProgramController::class, 'attendance']);
    Route::post('/store-attendance', [ProgramController::class, 'storeAttendance']);
    Route::post('/update-program-flow', [ProgramController::class, 'updateProgramFlow']);
    Route::post('/update-program-topic', [ProgramController::class, 'updateProgramTopic']);
    Route::post('/update-program-position', [ProgramController::class, 'updateProgramPosition']);
    Route::post('/unarchived-program', [ProgramController::class, 'unarchivedProgram']);
    Route::get('/program-flow/{program_id}', [ProgramController::class, 'programFlow']);
    Route::get('/archive-program/{program_id}', [ProgramController::class, 'archiveProgram']);
    Route::get('/get-archive-programs', [ProgramController::class, 'getArchives']);


    //partner management
    Route::post('/unarchived-partner', [PartnerController::class, 'unarchivedPartner']);
    Route::get('/archive-partner/{partner_id}', [PartnerController::class, 'archivePartner']);
    Route::get('/get-archive-partners', [PartnerController::class, 'getArchives']);
    Route::get('/partnerInfo/{id}', [PartnerController::class, 'partnerInfo']);
    Route::get('/partners', [PartnerController::class, 'index']);
    Route::post('/create-partner', [PartnerController::class, 'createPartner']);
    Route::post('/extend-partner', [PartnerController::class, 'extendPartner']);
    Route::post('/update-partner', [PartnerController::class, 'updatePartner']);


    //profile controller
    Route::get('/profileInfo/{id}', [ProfileController::class, 'index']);
    Route::post('/updateProfile', [ProfileController::class, 'updateProfile']);
    Route::get('/isEmailAvailable/{email}', [ProfileController::class, 'isEmailAvailable']);
    Route::post('/changeEmail', [ProfileController::class, 'changeEmail']);
    Route::post('/changePass', [ProfileController::class, 'changePass']);
    Route::post('/changeProfilePic', [ProfileController::class, 'changeProfilePic']);
    Route::get('/profile-image/{id}', [ProfileController::class, 'profileImage']);
    Route::post('/users-profile-images', [ProfileController::class, 'usersProfileImages']);

    //image controller
    Route::get('/images/{filename}', [ImageController::class, 'getImage']);
    Route::get('/download-file/{id}', [ImageController::class, 'downloadFile']);
    Route::get('/download-certfile/{id}', [ImageController::class, 'downloadCertFile']);
    Route::get('/download-moa/{id}', [ImageController::class, 'downloadMoa']);
    Route::post('/file', [ImageController::class, 'getUserFiles']);
    Route::get('/view-file/{filePath}', [ImageController::class, 'viewUserFiles']);
    Route::post('/program-file', [ImageController::class, 'getProgramFiles']);



    //dashboard controller
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/dashboard-chart/{month}', [DashboardController::class, 'dashboardChart']);
    Route::get('/user-dashboard/{user_id}', [DashboardController::class, 'userDashboardChart']);
    Route::post('/user-dashboard-chart', [DashboardController::class, 'userProgramChart']);
});
