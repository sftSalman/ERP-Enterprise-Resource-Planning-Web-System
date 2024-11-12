
### Create database

copy env.example and name it .env
Create database `hr-admin` from PHPMyadmin

### Run Seeder

```bash
php artisan migrate:fresh --seed
php artisan module:seed
```

### Install passport

```bash
php artisan passport:install
```

### Spatie cache clean

```bash
php artisan permission:cache-reset
```
### Spatie cache clean

```bash
php artisan serve or install laravel herd
```

### Make Module model-controller & module list & factory-seeder

```bash
php artisan module:make-model ModelName -m ModuleName
php artisan module:make-factory ModelName ModuleName
php artisan module:make-seed ModelName ModuleName
php artisan module:make-controller ModelNameController --api ModuleName
php artisan module:list
```

### Make Module Request

```bash
php artisan module:make-request ModelCreateRequest ModuleName
php artisan module:make-request ModelUpdateRequest ModuleName
```

### Prompt to select employees as API client

Which user provider should this client use to retrieve users?:

-   [0] employees

Enter `0` and continue.
