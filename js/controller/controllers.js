gloomApp.controller('gloomController', function($scope, $location, $rootScope) {
  var PlayMusic = require('playmusic');
  var request = require('request');
  var fs = require('fs');
  var pm = new PlayMusic();
  var os = require('os');
  var config = require('./config');

  pm.init({email: config.email, password: config.password}, function() {
    console.log("authed");
    //$scope.getAlbum();
  });

  //$rootScope.pm = pm;
  $scope.pm = pm;

  var playerVolume = 50;
  $scope.album = null;

  $('#volumeSlider').slider({
    range: "min",
    orientation: "horizontal",
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    animate: true,
    slide: function(e, ui) {
      playerVolume = ui.value;
      if(soundManager.getSoundById('player')) { soundManager.getSoundById('player').setVolume(playerVolume); }
    }
  });

  $('#progressSlider').slider({
    range: "min",
    orentation: "horizontal",
    value: 0,
    min: 0,
    max: 100,
    step: .1,
    animate: false,
    slide: function(e, ui) {
      if(soundManager.getSoundById('player')) { soundManager.getSoundById('player').setPosition(ui.value) ; }
    }
  });

  $scope.playpause = function() {
    if(soundManager.getSoundById('player')) {
      var playerState = soundManager.getSoundById('player').paused;
      if(playerState) {
        $('#playpauseicon').attr('class', 'glyphicon glyphicon-pause');
      } else {
        $('#playpauseicon').attr('class', 'glyphicon glyphicon-play');
      }

      soundManager.getSoundById('player').togglePause();
    }
  }



  $scope.playSong = function (playid) {
    console.log(playid);

    if(soundManager.getSoundById('player')) {
      soundManager.destroySound('player');
    }

    pm.getStreamUrl(playid, function(success, error) {

      soundManager.createSound({
        id: 'player',
        url: success,
        autoLoad: true,
        autoPlay: true,
        volume: playerVolume,
        onload: function() {
          $('#progressSlider').slider( "option", "max", this.duration);
        },
        whileplaying: function() {
          $('#progressSlider').slider( "value", this.position);
        },
        onfinish: function() {
          $('#progressSlider').slider( "value",  0 );
        }
      });

      $('#playpauseicon').attr('class', 'glyphicon glyphicon-pause');
    });

  };

  $scope.doSearch = function() {
    $('#srch-term').blur();
    $location.path('/sr/' + $scope.searchstring);
  };

  $scope.closeApp = function() {
    require('nw.gui').App.quit();
  }

  $scope.openDebugWindow = function() {
    require('nw.gui').Window.get().showDevTools();
  }

  $scope.goForward = function() {
    window.history.forward();
  }

  $scope.goBack = function() {
    window.history.back();
  }

});
