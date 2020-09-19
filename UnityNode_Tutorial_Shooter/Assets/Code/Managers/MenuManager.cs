using System;
using System.Collections;
using System.Collections.Generic;
using System.Net.Sockets;
using Project.Networking;
using Project.Utility;
using SocketIO;
using UnityEngine;
using UnityEngine.UI;

namespace Project.Managers {
    public class MenuManager : MonoBehaviour {

        [Header("Join Now")]
        [SerializeField]
        private GameObject joinContainer;
        
        [SerializeField]
        private Button queueButton;

        [Header("Sign In")]
        [SerializeField]
        private GameObject signInContainer;

        private string username;
        private string password;
        private SocketIOComponent socketReference;

        public SocketIOComponent SocketReference {
            get {
                return socketReference = (socketReference == null) ? FindObjectOfType<NetworkClient>() : socketReference;
            }
        }

        public void Start() {
            queueButton.interactable = false;
            signInContainer.SetActive(false);
            joinContainer.SetActive(false);

            NetworkClient.OnSignInComplete += OnSignInComplete;
            
            SceneManagementManager.Instance.LoadLevel(SceneList.ONLINE, (levelName) => {
                signInContainer.SetActive(true);
                joinContainer.SetActive(false);
                queueButton.interactable = true;
            });
        }

        public void OnQueue() {
            SocketReference.Emit("joinGame");
        }

        public void OnSignIn() {
            SocketReference.Emit("signIn", new JSONObject(JsonUtility.ToJson(new SignInData() {
                username = username,
                password = password
            })));
        }

        public void OnSignInComplete() {
            signInContainer.SetActive(false);
            joinContainer.SetActive(true);
            queueButton.interactable = true;
        }

        public void OnCreateAccount() {
            SocketReference.Emit("createAccount", new JSONObject(JsonUtility.ToJson(new SignInData() {
                username = username,
                password = password
            })));
        }

        public void EditUsername(string text) {
            username = text;
        }
        
        public void EditPassword(string text) {
            password = text;
        }
    }

    [Serializable]
    public class SignInData {
        public string username;
        public string password;
    }
}
