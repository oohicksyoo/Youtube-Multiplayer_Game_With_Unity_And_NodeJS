#if UNITY_EDITOR
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEditor;
using UnityEngine;

namespace Project.Utility {
	public class LevelDataEditor : ScriptableWizard {
		public GameObject levelDataParent;

		[MenuItem("Tools/Level Data")]
		public static void CreateWizard() {
			DisplayWizard<LevelDataEditor>("Create level data for the server", "Create");
		}

		public void OnWizardUpdate() {
			isValid = levelDataParent != null;
		}

		public void OnWizardCreate() {
			List<LevelDataHelper> children = levelDataParent.GetComponentsInChildren<LevelDataHelper>().ToList();
			
			LevelData levelData = new LevelData();
			levelData.teamOneSpawn = new List<LevelDataElement>();
			levelData.teamTwoSpawn = new List<LevelDataElement>();
			levelData.itemSpawn = new List<LevelDataElement>();
			levelData.freeForAllSpawn = new List<LevelDataElement>();
			
			children.ForEach(child => {
				var data = LevelDataElement.Default;
				data.radius = child.Radius;
				data.position.x = child.transform.position.x;
				data.position.y = child.transform.position.y;

				switch (child.Type) {
					case LevelDataHelperType.Team_One_Spawn:
						levelData.teamOneSpawn.Add(data);
						break;
					case LevelDataHelperType.Team_Two_Spawn:
						levelData.teamTwoSpawn.Add(data);
						break;
					case LevelDataHelperType.Item_Spawn:
						levelData.itemSpawn.Add(data);
						break;
					case LevelDataHelperType.Free_For_All_Spawn:
						levelData.freeForAllSpawn.Add(data);
						break;
				}
			});

			string exportData = JsonUtility.ToJson(levelData);
			Debug.Log(exportData);
		}
	}
}
#endif
