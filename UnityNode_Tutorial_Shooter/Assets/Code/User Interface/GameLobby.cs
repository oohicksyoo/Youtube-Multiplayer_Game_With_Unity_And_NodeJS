using System.Collections;
using System.Collections.Generic;
using Project.Networking;
using SocketIO;
using UnityEngine;

namespace Project.UserInterface {
    public class GameLobby : MonoBehaviour {

        [SerializeField]
        private GameObject gameLobbyContainer;
        
        public void Start() {

            NetworkClient.OnGameStateChange += OnGameStateChange;
            
            //Initial Turn off screens
            gameLobbyContainer.SetActive(false);
        }

        private void OnGameStateChange(SocketIOEvent e) {
            string state = e.data["state"].str;

            switch (state) {
                case "Game":
                    gameLobbyContainer.SetActive(false);
                    break;
                case "EndGame":
                    gameLobbyContainer.SetActive(false);
                    break;
                case "Lobby":
                    gameLobbyContainer.SetActive(true);
                    break;
                default:
                    gameLobbyContainer.SetActive(false);
                    break;
            }
        }
    }
}
