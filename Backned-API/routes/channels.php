<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated employee can listen to the channel.
|
*/

Broadcast::channel('App.Models.Employee.{id}', function ($employee, $id) {
    return (int) $employee->id === (int) $id;
});
