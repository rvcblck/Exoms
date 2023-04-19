<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    use HasFactory;

    protected $fillable = ['program_id', 'user_id','leader'];

    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }

    public function program()
    {
        return $this->belongsTo(Program::class,'program_id');
    }
}


