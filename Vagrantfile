# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API version (consider keeping it updated)
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  # Use a newer Debian version (check available official boxes)
  config.vm.box = "debian/buster64"

  # Consider using official Debian boxes from Hashicorp Atlas
  # Replace with the appropriate URL if needed
  # config.vm.box_url = "https://atlas.hashicorp.com/debian/boxes/buster64"

  # Private network configuration (adjust IP if needed)
  config.vm.network "private_network", ip: "192.168.50.50"

  # Forwarded port configuration (adjust ports as needed)
  config.vm.network "forwarded_port", guest: 36001, host: 36001

  # Synced folder configuration (adjust paths if needed)
  config.vm.synced_folder ".", "/vagrant"

  # VirtualBox provider configuration
  config.vm.provider "virtualbox" do |vb|
    # Enable NAT DNS host resolver (consider security implications)
    vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]

    # Increase memory allocation (adjust based on your needs)
    vb.memory = "2048"
  end

end
