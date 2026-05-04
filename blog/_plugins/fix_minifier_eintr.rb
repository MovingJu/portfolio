Jekyll::Hooks.register :site, :after_reset do |site|
  FileUtils.mkdir_p(site.dest)
  FileUtils.touch(File.join(site.dest, '.metadata_never_index'))
end
