<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Partner extends Model
{
    use HasFactory;

    protected $primaryKey = 'partner_id';
    public $incrementing = false;

    protected $fillable = [
        'partner_id',
        'company_name',
        'address',
        'contact_no',
        'contact_person',
        'moa_file',
        'archived',
    ];


    public function programs()
    {
        return $this->belongsToMany(Program::class, 'relations', 'partner_id', 'program_id');
    }

    public function contracts()
    {
        return $this->hasMany(Contract::class,'partner_id');
    }


}
