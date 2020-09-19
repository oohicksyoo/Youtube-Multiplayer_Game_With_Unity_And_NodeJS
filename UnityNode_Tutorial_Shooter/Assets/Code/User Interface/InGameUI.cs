using Project.Networking;
using SocketIO;
using UnityEngine;

namespace Project.UserInterface {
	public class InGameUI : MonoBehaviour {
		[SerializeField]
		private GameObject gameLobbyContainer;

		[SerializeField]
		private NetworkClient networkClient;
        
		public void Start() {

			NetworkClient.OnGameStateChange += OnGameStateChange;
            
			//Initial Turn off screens
			gameLobbyContainer.SetActive(false);
		}

		private void OnGameStateChange(SocketIOEvent e) {
			string state = e.data["state"].str;

			switch (state) {
				case "Game":
					gameLobbyContainer.SetActive(true);
					break;
				case "EndGame":
					gameLobbyContainer.SetActive(false);
					break;
				case "Lobby":
					gameLobbyContainer.SetActive(false);
					break;
				default:
					gameLobbyContainer.SetActive(false);
					break;
			}
		}

		public void OnQuit() {
			networkClient.OnQuit();
		}
	}
}