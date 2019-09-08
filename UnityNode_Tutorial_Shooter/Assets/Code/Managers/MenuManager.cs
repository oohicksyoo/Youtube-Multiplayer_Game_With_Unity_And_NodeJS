using System.Collections;
using System.Collections.Generic;
using Project.Networking;
using Project.Utility;
using SocketIO;
using UnityEngine;
using UnityEngine.UI;

namespace Project.Managers {
    public class MenuManager : MonoBehaviour {

        [SerializeField]
        private Button queueButton;

        private SocketIOComponent socketReference;

        public SocketIOComponent SocketReference {
            get {
                return socketReference = (socketReference == null) ? FindObjectOfType<NetworkClient>() : socketReference;
            }
        }

        public void Start() {
            queueButton.interactable = false;
            
            SceneManagementManager.Instance.LoadLevel(SceneList.ONLINE, (levelName) => {
                queueButton.interactable = true;
            });
        }

        public void OnQueue() {
            SocketReference.Emit("joinGame");
        }
    }
}
