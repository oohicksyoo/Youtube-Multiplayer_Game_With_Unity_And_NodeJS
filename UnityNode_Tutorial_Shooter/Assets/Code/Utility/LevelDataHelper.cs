#if UNITY_EDITOR
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEditor;
using UnityEngine;

namespace Project.Utility {
	public class LevelDataHelper : MonoBehaviour {

		[SerializeField]
		private float radius = 1;

		[SerializeField]
		private LevelDataHelperType type;

		public float Radius {
			get {
				return radius;
			}
		}

		public LevelDataHelperType Type {
			get {
				return type;
			}
		}

		public void OnDrawGizmos() {
			Handles.color = TypeToColour(this.Type);
			Handles.DrawWireDisc(transform.position, Vector3.forward, radius);
		}

		private Color TypeToColour(LevelDataHelperType type) {
			switch (type) {
				case LevelDataHelperType.Team_One_Spawn:
					return Color.blue;
				case LevelDataHelperType.Team_Two_Spawn:
					return Color.green;
				case LevelDataHelperType.Item_Spawn:
					return Color.yellow;
				case LevelDataHelperType.Free_For_All_Spawn:
					return Color.cyan;
			}

			return Color.black;
		}
	}

	public enum LevelDataHelperType {
		Team_One_Spawn = 0,
		Team_Two_Spawn,
		Item_Spawn,
		Free_For_All_Spawn
	}

	[Serializable]
	public class LevelData {
		public List<LevelDataElement> teamOneSpawn;
		public List<LevelDataElement> teamTwoSpawn;
		public List<LevelDataElement> itemSpawn;
		public List<LevelDataElement> freeForAllSpawn;
	}
	
	[Serializable]
	public class LevelDataElement {
		public float radius;
		public Vect2 position;

		public static LevelDataElement Default {
			get {
				LevelDataElement e = new LevelDataElement();
				e.radius = 1.0f;
				e.position = new Vect2();
				e.position.x = 0;
				e.position.y = 0;
				return e;
			}
		}
	}
	
	[Serializable]
	public class Vect2 {
		public float x;
		public float y;
	}
}
#endif
