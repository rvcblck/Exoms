<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasFactory;

    protected $fillable = [
        'program_id',
        'title',
        'start_date',
        'end_date',
        'place',
        'details',
        'certificate',
        'invitation',
        'archived',
    ];

    protected $primaryKey = 'program_id';
    public $incrementing = false;

    public function members()
    {
        return $this->belongsToMany(User::class, 'members', 'program_id', 'user_id')->withPivot('leader');
    }

    public function partners()
    {
        return $this->belongsToMany(Partner::class, 'relations', 'program_id', 'partner_id');
    }

    public function participants()
    {
        return $this->hasMany(Participant::class,'program_id');
    }

    public function attendances()
    {
        return $this->hasManyThrough(Attendance::class, Participant::class,);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'members','program_id','user_id')->withPivot('leader');
    }







}

