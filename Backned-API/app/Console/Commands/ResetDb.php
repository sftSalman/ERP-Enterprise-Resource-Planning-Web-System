<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ResetDb extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:reset';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset database and clear it for fresh works';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

//        DB::table(Employee::TABLE_NAME)->whereNotIn('id', [1])->delete();

//        DB::table('model_has_roles')->whereNotIn('model_id', [1])->delete();
//        DB::table('roles')->where('id', '>', 9)->delete();
        // DB::table(ProductRate::TABLE_NAME)->truncate();
        // DB::table(Product::TABLE_NAME)->truncate();

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        return 1;
    }
}
