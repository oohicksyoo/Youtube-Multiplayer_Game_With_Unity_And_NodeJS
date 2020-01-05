using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Project.AI {
	public class AIManager : MonoBehaviour {
		
		const float BARREL_PIVOT_OFFSET = 90.0f;
		
		[SerializeField]
		private Transform tankTransform;

		[SerializeField]
		private Transform barrelTransform;

		public void SetBarrelRotation(float value) {
			barrelTransform.localEulerAngles = new Vector3(0, 0, value + BARREL_PIVOT_OFFSET);
		}
	}
}

