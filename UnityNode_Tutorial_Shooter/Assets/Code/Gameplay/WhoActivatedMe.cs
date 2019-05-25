using Project.Utility.Attributes;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Project.Gameplay {
    public class WhoActivatedMe : MonoBehaviour {

        [SerializeField]
        [GreyOut]
        private string whoActivatedMe;

        public void SetActivator(string ID) {
            whoActivatedMe = ID;
        }

        public string GetActivator() {
            return whoActivatedMe;
        }
    }
}
