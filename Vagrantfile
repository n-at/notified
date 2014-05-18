VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.box = "precise32"
  config.vm.network "forwarded_port", guest: 27017, host: 27017
  config.vm.provision "shell", path: "vagrant_provision.sh"

end
