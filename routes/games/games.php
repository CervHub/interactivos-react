<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware(['auth'])->group(function () {
    Route::get('games', function () {
        return Inertia::render('game/index');  //resources\js\pages\game\index.tsx
    })->name('games');

    Route::get('games/{id}', function ($id) {
        return Inertia::render('game/show', [
            'id' => $id
        ]);   //resources\js\pages\game\show.tsx
    })->name('game.details');
});
