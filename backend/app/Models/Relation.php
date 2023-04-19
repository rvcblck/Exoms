<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Relation extends Model
{
    use HasFactory;



    protected $fillable = ['program_id', 'partner_id'];

    public function program()
    {
        return $this->belongsTo(Program::class,'program_id');
    }

    public function partner()
    {
        return $this->belongsTo(Partner::class,'partner_id');
    }
}
