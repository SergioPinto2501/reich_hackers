from mitreattack.stix20 import MitreAttackData

class MitreAttackClass:
    def __init__(self):
        self.mitre_attack_data = MitreAttackData("classes\MitreAttackAPI\enterprise-attack.json")


    def get_tecnique_by_id(self, id):
        return self.mitre_attack_data.get_technique_by_id(id)
