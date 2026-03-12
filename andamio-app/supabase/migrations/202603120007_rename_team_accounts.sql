update public.profiles
set
  full_name = 'Lic. Emilia Alvarez',
  email = 'emilia@andamio.app'
where id = '11111111-1111-1111-1111-111111111111';

update public.profiles
set
  full_name = 'Prof. Rosario Figueroa',
  email = 'rosario@andamio.app'
where id = '11111111-1111-1111-1111-111111111112';

update public.profiles
set
  full_name = 'Prof. Agustina Guzman',
  email = 'agustina@andamio.app'
where id = '11111111-1111-1111-1111-111111111113';

update public.institutions
set lead_name = 'Lic. Emilia Alvarez'
where id = '22222222-2222-2222-2222-222222222221';

update public.institutions
set lead_name = 'Prof. Rosario Figueroa'
where id = '22222222-2222-2222-2222-222222222222';

update public.institutions
set lead_name = 'Prof. Agustina Guzman'
where id = '22222222-2222-2222-2222-222222222223';

update public.courses
set teacher_name = 'Emilia Alvarez'
where id = '33333333-3333-3333-3333-333333333333';

update public.courses
set teacher_name = 'Agustina Guzman'
where id = '33333333-3333-3333-3333-333333333334';
