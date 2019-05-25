using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

namespace Project.Scriptable {
    [CreateAssetMenu(fileName = "Server_Objects", menuName = "Scriptable Objects/Server Objects", order = 3)]
    public class ServerObjects : ScriptableObject {
        public List<ServerObjectData> Objects;

        public ServerObjectData GetObjectByName(string Name) {
            return Objects.SingleOrDefault(x => x.Name == Name);
        }
	}

    [Serializable]
    public class ServerObjectData {
        public string Name = "New Object";
        public GameObject Prefab;
    }
}
