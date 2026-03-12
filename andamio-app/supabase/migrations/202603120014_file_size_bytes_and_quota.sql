alter table public.files
add column if not exists file_size_bytes bigint not null default 0;

update public.files
set file_size_bytes = case
  when file_size_label ilike '% GB' then round((regexp_replace(file_size_label, '[^0-9\\.]', '', 'g'))::numeric * 1024 * 1024 * 1024)
  when file_size_label ilike '% MB' then round((regexp_replace(file_size_label, '[^0-9\\.]', '', 'g'))::numeric * 1024 * 1024)
  when file_size_label ilike '% KB' then round((regexp_replace(file_size_label, '[^0-9\\.]', '', 'g'))::numeric * 1024)
  when file_size_label ilike '% B' then round((regexp_replace(file_size_label, '[^0-9\\.]', '', 'g'))::numeric)
  else file_size_bytes
end
where (file_size_bytes = 0 or file_size_bytes is null)
  and file_size_label is not null;
