<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PasswordChange extends Model
{
    use HasFactory;

    protected $table = 'password_change';

    protected $fillable = [
        'password_id',
        'user_id',
        'password',
        'change_date',
        'reset_token'
    ];

    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }

}
