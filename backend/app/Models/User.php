<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject, MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $primaryKey = 'user_id';
    public $incrementing = false;



    protected $fillable = [
        'user_id',
        'fname',
        'mname',
        'lname',
        'suffix',
        'gender',
        'bday',
        'email',
        'mobile_no',
        'address',
        'role',
        'status',
        'archived',
        'profile_pic'

    ];




    protected $casts = [
        'email_verified_at' => 'datetime',
        'user_id' => 'string',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->role,
        ];
    }

    public function verificationCodes()
    {
        return $this->hasMany(VerificationCode::class,'user_id');
    }

    public function passwordChanges()
    {
        return $this->hasMany(PasswordChange::class,'user_id');
    }

    public function programs()
    {
        return $this->belongsToMany(Program::class, 'members', 'user_id', 'program_id')->withPivot('leader');
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'members', 'user_id', 'program_id')->withPivot('leader');
    }


}
