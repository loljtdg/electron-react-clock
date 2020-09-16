const Datastore  =  require('nedb')
const { remote } = window.require('electron');
const path = window.require('path')

const timedb = new Datastore({ filename: path.join(remote.app.getPath('userData'),'/time.db'), autoload: true });
const toastdb = new Datastore({ filename: path.join(remote.app.getPath('userData'),'/toast.db'), autoload: true });

export {
    timedb,
    toastdb
}