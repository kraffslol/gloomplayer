gloomApp.controller('gloomController', function($scope, $location, $rootScope) {
  var PlayMusic = require('playmusic');
  var request = require('request');
  var fs = require('fs');
  var pm = new PlayMusic();
  var os = require('os');
  var config = require('./config');
  var lastfm = require('simple-lastfm');
  var moment = require('moment');

  $scope.moment = moment;

  pm.init({email: config.email, password: config.password}, function() {
    console.log("authed");
    $scope.authed = true;
    $rootScope.$broadcast("login");
  });

  $scope.pm = pm;

  // Enable lastfm if in config.
  if(config.lastfmusername && config.lastfmpassword) {
    $scope.lastfm = new lastfm({
      api_key: 'b7166ea278d7c5e593528b1bfe147e2c',
      api_secret: '3c7676529b6730fa34c0da9f3417bc2e',
      username: config.lastfmusername,
      password: config.lastfmpassword
    });

    $scope.lastfm.getSessionKey(function(result) {
      console.log("Lastfm Session Key: " + result.session_key);
      if(result.error) {
        console.log("LastFm Error: " + result.error);
      }
    });
  }

  var playerVolume = 50;
  $scope.album = null;
  $scope.artist = null;
  $scope.title = null;
  $scope.albumart = null;

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



  $scope.playSong = function (track) {
    var playid = track.nid;
    console.log(track);

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

          // Set title and artist
          $scope.artist = track.artist;
          $scope.title = track.title;
          $scope.albumart = track.albumArtRef[0].url;
          $scope.$apply();
        },
        onplay: function() {
          // Update now playing
          if($scope.lastfm) {
            $scope.lastfm.scrobbleNowPlayingTrack({
              artist: track.artist,
              track: track.title
            });
          }
        },
        whileplaying: function() {
          $('#progressSlider').slider( "value", this.position);
        },
        onfinish: function() {
          $('#progressSlider').slider( "value",  0 );
          // Scrobble
          if($scope.lastfm) {
            $scope.lastfm.scrobbleTrack({
              artist: track.artist,
              track: track.title
            });
          }
        }
      });

      $('#playpauseicon').attr('class', 'glyphicon glyphicon-pause');
    });

  };

  $scope.doSearch = function() {
    $('#srch-term').blur();
    $location.path('/sr/' + $scope.searchstring);
  };

  /*
    NW SPECIFIC
  */

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

  /*
   KEYBINDS
  */

  Mousetrap.bind('space', function() {
    $scope.playpause();
  });

  Mousetrap.bind('f5', function() {
    location.reload();
  });

});
